import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: '請輸入有效的 Email 地址。' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.MAILCHIMP_API_KEY;
    const audienceId = import.meta.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return new Response(
        JSON.stringify({ error: '訂閱服務暫時無法使用，請稍後再試。' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const dc = apiKey.split('-').pop();

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['八字研究所', 'website-subscribe'],
        }),
      }
    );

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    if (data.title === 'Member Exists') {
      return new Response(
        JSON.stringify({ error: '此 Email 已經訂閱過了。' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: '訂閱失敗，請稍後再試。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: '網路錯誤，請稍後再試。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
