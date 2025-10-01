import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo } from '../../utils/common'
import { API_KEY, API_URL } from '@/config'

export async function DELETE(request: NextRequest, { params }: { params: { conversationId: string } }) {
  const { user } = getInfo(request)
  try {
    const response = await fetch(`${API_URL}/conversations/${params.conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ user }),
    })
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    return NextResponse.json({ success: true })
  }
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
