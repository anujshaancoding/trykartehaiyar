import { NextResponse } from 'next/server'
import { getProjectBySlug } from '@/data/projects'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Missing download token. Please purchase first.' },
        { status: 401 }
      )
    }

    // Validate token
    const isValid = await validateToken(token, id)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired download token. Please purchase again or contact support.' },
        { status: 403 }
      )
    }

    const project = getProjectBySlug(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Download from GitHub private repo
    const githubToken = process.env.GITHUB_PAT
    const githubRepo = process.env.GITHUB_PROJECT_FILES_REPO // e.g. "yourname/tkhy-project-files"

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { error: 'Download service not configured. Contact admin.' },
        { status: 500 }
      )
    }

    // Fetch file from GitHub using Contents API
    // File path in repo: {slug}/{slug}.zip
    const filePath = `${id}/${id}.zip`
    const githubApiUrl = `https://api.github.com/repos/${githubRepo}/contents/${filePath}`

    const githubRes = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!githubRes.ok) {
      const errData = await githubRes.json().catch(() => ({}))
      console.error('GitHub API error:', githubRes.status, errData)

      if (githubRes.status === 404) {
        return NextResponse.json(
          { error: 'Project file not yet uploaded. Contact support.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to fetch download. Please try again.' },
        { status: 500 }
      )
    }

    const fileData = await githubRes.json()

    // GitHub Contents API returns download_url for files < 100MB
    // For larger files, use the git blob API
    if (fileData.download_url) {
      // Generate a proxied download — don't expose the raw GitHub URL
      // (it contains the token in redirect chain for private repos)
      // Instead, fetch the file and stream it to the user
      const fileRes = await fetch(fileData.download_url, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      })

      if (!fileRes.ok) {
        return NextResponse.json(
          { error: 'Download failed. Please try again.' },
          { status: 500 }
        )
      }

      const fileBuffer = await fileRes.arrayBuffer()

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${id}.zip"`,
          'Content-Length': fileBuffer.byteLength.toString(),
          'Cache-Control': 'no-store',
        },
      })
    }

    // For files > 100MB, use the blob SHA
    if (fileData.sha) {
      const blobUrl = `https://api.github.com/repos/${githubRepo}/git/blobs/${fileData.sha}`
      const blobRes = await fetch(blobUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      })

      if (!blobRes.ok) {
        return NextResponse.json(
          { error: 'Download failed for large file. Contact support.' },
          { status: 500 }
        )
      }

      const blobBuffer = await blobRes.arrayBuffer()

      return new NextResponse(blobBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${id}.zip"`,
          'Content-Length': blobBuffer.byteLength.toString(),
          'Cache-Control': 'no-store',
        },
      })
    }

    return NextResponse.json(
      { error: 'Unexpected file format. Contact support.' },
      { status: 500 }
    )
  } catch (err) {
    console.error('Download API error:', err)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}

async function validateToken(token, projectId) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'fallback-secret'
    const decoded = atob(token)
    const parts = decoded.split(':')

    if (parts.length !== 4) return false

    const [tokenProjectId, paymentId, expires, hash] = parts

    if (tokenProjectId !== projectId) return false
    if (Date.now() > parseInt(expires, 10)) return false

    const encoder = new TextEncoder()
    const payload = `${tokenProjectId}:${paymentId}:${expires}`

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedHash = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return expectedHash === hash
  } catch {
    return false
  }
}
