import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, baziChart } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: '請填寫姓名和 Email。' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: '郵件服務暫時無法使用，請稍後再試。' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'StarKami 八字研究所 <onboarding@resend.dev>',
      to: 'contact@starkami.com',
      subject: `【諮詢預約】${name} 的命理諮詢請求`,
      html: `
        <h2>新的命理諮詢預約</h2>
        <p><strong>姓名：</strong>${name}</p>
        <p><strong>Email：</strong>${email}</p>
        <p><strong>諮詢內容：</strong></p>
        <p>${message || '未填寫'}</p>
        ${baziChart ? `<p><strong>八字命盤：</strong>${baziChart}</p>` : ''}
        <hr>
        <p style="color: #999; font-size: 12px;">此郵件由 StarKami 八字研究所自動發送</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Consultation email error:', error);
    return new Response(
      JSON.stringify({ error: '送出失敗，請稍後再試。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
