import type { APIRoute } from 'astro';
import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      birthDate,
      birthHour,
      gender,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      dayMaster,
      fiveElements,
      tenGods,
      question,
    } = body;

    if (!birthDate || !dayPillar) {
      return new Response(
        JSON.stringify({ error: '缺少必要的命盤資料。' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.XAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AI 服務暫時無法使用，請稍後再試。' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const xai = createXai({ apiKey });

    const genderText = gender === 'male' ? '男' : '女';
    const fiveElementsText = fiveElements
      ? Object.entries(fiveElements).map(([el, count]) => `${el}：${count}`).join('、')
      : '';
    const tenGodsText = tenGods
      ? tenGods.map((tg: { pillar: string; god: string }) => `${tg.pillar}：${tg.god}`).join('、')
      : '';

    let questionPrompt = '';
    if (question === 'career') questionPrompt = '請特別針對事業與工作發展深入分析。';
    else if (question === 'wealth') questionPrompt = '請特別針對財運與投資方向深入分析。';
    else if (question === 'love') questionPrompt = '請特別針對感情與婚姻深入分析。';
    else if (question === 'health') questionPrompt = '請特別針對健康與養生深入分析。';

    const prompt = `你是一位精通八字命理的國學大師，擁有數十年的命理研究經驗。請根據以下命盤資料，為命主提供專業、詳細的命理解讀。

命主資料：
- 出生日期：${birthDate}
- 出生時辰：${birthHour}時
- 性別：${genderText}

四柱八字：
- 年柱：${yearPillar}
- 月柱：${monthPillar}
- 日柱：${dayPillar}（日主）
- 時柱：${hourPillar}

日主：${dayMaster}
五行分布：${fiveElementsText}
十神：${tenGodsText}

${questionPrompt}

請按照以下結構進行分析：

一、命盤總論
概述命盤的整體格局、日主強弱、五行平衡狀況。

二、具體解讀
1. 事業運：根據命盤分析適合的職業方向與發展時機。
2. 財運：分析正財與偏財的狀況，給出理財建議。
3. 感情運：分析感情模式與婚姻狀況。
4. 健康：根據五行偏缺分析需要注意的健康問題。

三、行動建議
根據命盤給出具體可行的改善建議（如五行補救、方位選擇等）。

四、總結
用一段話總結命主的人生特質與未來展望。

請使用繁體中文，語氣專業但親切，避免過於絕對的論斷。`;

    const { text } = await generateText({
      model: xai('grok-3-mini-fast'),
      prompt,
      maxTokens: 1200,
    });

    return new Response(
      JSON.stringify({ interpretation: text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI interpretation error:', error);
    return new Response(
      JSON.stringify({ error: 'AI 解讀過程中發生錯誤，請稍後再試。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
