export const normalizeDialogue = (dialogue) => {
  if (typeof dialogue === 'string') {
    return { english: dialogue, vietnamese: '', audioFileName: '' };
  }

  return {
    english: dialogue?.english || dialogue?.en || '',
    vietnamese: dialogue?.vietnamese || dialogue?.vi || ''
    vietnamese: dialogue?.vietnamese || dialogue?.vi || '',
    audioFileName: dialogue?.audioFileName || dialogue?.audio || dialogue?.audioUrl || ''
  };
};

export const normalizeVocabulary = (vocabulary) => {
  if (!vocabulary) return { items: [], note: '' };
  if (typeof vocabulary === 'string') return { items: [], note: vocabulary };
  if (Array.isArray(vocabulary)) return { items: vocabulary, note: '' };
  if (typeof vocabulary === 'object') {
    const items = Array.isArray(vocabulary.items) ? vocabulary.items : [];
    return { items, note: vocabulary.note || '' };
  }
  return { items: [], note: '' };
};

export const buildAudioSrc = (audioBaseUrl, fileName) => {
  if (!fileName) return '';
  const cleanedBaseUrl = (audioBaseUrl || '').replace(/\/$/, '');
  return `${cleanedBaseUrl}/${fileName}`;
};
