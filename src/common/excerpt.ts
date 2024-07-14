import { JsonContentDto } from '../articles/dto/content.dto';

export const generateExcerpt = (content: JsonContentDto[]): string => {
  if (!content || content.length === 0) {
    return '';
  }

  let excerpt = '';

  for (const block of content) {
    if (block.type === 'paragraph' && block.data?.text) {
      excerpt += block.data.text.replace(/<[^>]*>?/gm, '') + '\n';
    }
    if (excerpt.length >= 500) {
      excerpt = excerpt.substring(0, 500).trim() + '...';
      break;
    }
  }

  return excerpt;
};
