import { promises as fs } from 'fs';
import path from 'path';

const forumDataPath = path.resolve(process.cwd(), 'server/data/forumPosts.json');

const defaultData = {
  posts: [
    {
      id: 'post-1',
      translationId: 'post1',
      author: 'Maya (Physics Explorer)',
      subject: 'Physics',
      createdAt: '2024-04-14T10:15:00Z',
      content:
        'I used the velocity simulation from the Physics lessons to practice English direction words. Try describing the movement using north, south, east, west!',
      comments: [
        {
          id: 'comment-1',
          translationId: 'comment1',
          author: 'Leo',
          createdAt: '2024-04-14T12:05:00Z',
          content: 'Thanks Maya! I will add arrows to my science notebook to explain directions.'
        }
      ]
    },
    {
      id: 'post-2',
      translationId: 'post2',
      author: 'Sara (Future Biologist)',
      subject: 'Biology',
      createdAt: '2024-04-13T08:45:00Z',
      content:
        'Does anyone have tips for remembering the steps of photosynthesis in English? I created a song with “sunlight, water, and carbon dioxide” as the chorus.',
      comments: [
        {
          id: 'comment-2',
          translationId: 'comment2',
          author: 'Aisha',
          createdAt: '2024-04-13T09:10:00Z',
          content: 'I like to make a diagram with labels: sunlight → leaves → glucose. Maybe we can share our songs?'
        },
        {
          id: 'comment-3',
          translationId: 'comment3',
          author: 'Diego',
          createdAt: '2024-04-13T10:02:00Z',
          content: 'My teacher says to remember “plants use light to cook sugar.” Simple but it helps!'
        }
      ]
    },
    {
      id: 'post-3',
      translationId: 'post3',
      author: 'Ms. Lopez (English Coach)',
      subject: 'English for Science',
      createdAt: '2024-04-12T15:30:00Z',
      content:
        'How do you explain lab safety rules in English? Share the verbs you use when giving instructions such as "wear", "measure", and "record".',
      comments: [
        {
          id: 'comment-4',
          translationId: 'comment4',
          author: 'Omar',
          createdAt: '2024-04-12T16:00:00Z',
          content: 'I start sentences with action verbs: Wear goggles. Measure the liquid carefully. Record your results.'
        }
      ]
    }
  ]
};

async function ensureForumFile() {
  try {
    await fs.access(forumDataPath);
  } catch (error) {
    await fs.mkdir(path.dirname(forumDataPath), { recursive: true });
    await fs.writeFile(forumDataPath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export async function readForumData() {
  await ensureForumFile();
  const contents = await fs.readFile(forumDataPath, 'utf8');
  try {
    const parsed = JSON.parse(contents);
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : []
    };
  } catch (error) {
    return { posts: [] };
  }
}

export async function writeForumData(data) {
  await ensureForumFile();
  const merged = {
    posts: Array.isArray(data.posts) ? data.posts : []
  };
  await fs.writeFile(forumDataPath, JSON.stringify(merged, null, 2), 'utf8');
}
