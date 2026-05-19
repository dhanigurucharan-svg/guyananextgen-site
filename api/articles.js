const NOTION_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function getArticles() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
      page_size: 50,
    }),
  });

  const data = await res.json();

  return (data.results || []).map(page => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text || '',
      author: props.Author?.rich_text?.[0]?.plain_text || '',
      category: props.Category?.select?.name || '',
      date: props.Date?.date?.start || '',
      readTime: props['Read Time']?.rich_text?.[0]?.plain_text || '',
      summary: props.Summary?.rich_text?.[0]?.plain_text || '',
      coverImage: props['Cover Image']?.url || '',
    };
  });
}

async function getArticle(pageId) {
  // Get page properties
  const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const page = await pageRes.json();
  if (page.object === 'error') return null;

  const props = page.properties;

  // Get page content blocks
  const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const blocksData = await blocksRes.json();

  const blocks = (blocksData.results || []).map(block => {
    const type = block.type;
    let content = '';

    if (block[type]?.rich_text) {
      content = block[type].rich_text.map(t => {
        let text = t.plain_text || '';
        if (t.annotations?.bold) text = `<strong>${text}</strong>`;
        if (t.annotations?.italic) text = `<em>${text}</em>`;
        if (t.annotations?.code) text = `<code>${text}</code>`;
        if (t.href) text = `<a href="${t.href}">${text}</a>`;
        return text;
      }).join('');
    }

    return { type, content };
  });

  return {
    id: page.id,
    title: props.Name?.title?.[0]?.plain_text || '',
    author: props.Author?.rich_text?.[0]?.plain_text || '',
    category: props.Category?.select?.name || '',
    date: props.Date?.date?.start || '',
    readTime: props['Read Time']?.rich_text?.[0]?.plain_text || '',
    summary: props.Summary?.rich_text?.[0]?.plain_text || '',
    coverImage: props['Cover Image']?.url || '',
    blocks,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!NOTION_KEY || !DATABASE_ID) {
    return res.status(500).json({ error: 'Notion API not configured' });
  }

  try {
    const articleId = req.query.id;

    if (articleId) {
      const article = await getArticle(articleId);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      // Cache for 60 seconds
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ article });
    }

    const articles = await getArticles();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ articles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
