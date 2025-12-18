export const defaultLearningTracks = [
  {
    id: 'efs-grade-10',
    subject: 'English for Science',
    gradeLevel: '10',
    summary:
      'Bấm vào khối 10 để xem 7 chapter do admin thêm. Chọn Chapter 4 rồi mở Lesson 7 để thấy 3 mục VOCABULARY/QUIZZES/DIALOGUE.',
    heroImage: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    documentUrl: '',
    youtubeUrl: '',
    quizQuestions: [],
    chapters: Array.from({ length: 7 }).map((_, index) => {
      const chapterNumber = index + 1;
      const lessonCount = chapterNumber === 4 ? 8 : 2;
      return {
        id: `efs-10-ch-${chapterNumber}`,
        title: `Chapter ${chapterNumber}`,
        description:
          chapterNumber === 4
            ? 'Từ vựng và bài luyện nghe/nói tập trung vào thí nghiệm hóa học đơn giản.'
            : 'Nội dung mẫu để admin chỉnh sửa hoặc thay thế.',
        lessons: Array.from({ length: lessonCount }).map((__, lessonIndex) => {
          const lessonNumber = lessonIndex + 1;
          return {
            id: `efs-10-ch-${chapterNumber}-lesson-${lessonNumber}`,
            title: `Lesson ${lessonNumber}`,
            sections: {
              vocabulary:
                lessonNumber === 7 && chapterNumber === 4
                  ? {
                      items: [
                        {
                          term: 'beaker',
                          translation: 'cốc đong thủy tinh',
                          audioFileName: 'sample-beaker.mp3'
                        },
                        {
                          term: 'observe',
                          translation: 'quan sát',
                          audioFileName: 'sample-observe.mp3'
                        }
                      ],
                      note: '10 thuật ngữ chính: beaker, observe, mixture, stir, measure, spill, safety goggles, reaction, timer, record.'
                    }
                  : { items: [], note: 'Thêm từ vựng chính tại đây.' },
              quizzes:
                lessonNumber === 7 && chapterNumber === 4
                  ? 'Viết 5 câu mô tả các bước của thí nghiệm pha dung dịch muối. Đọc to và thu âm lại.'
                  : 'Thêm bài tập/quiz hoặc hướng dẫn thực hành.',
              dialogue:
                lessonNumber === 7 && chapterNumber === 4
                  ? {
                      english: 'A: “Which tool do we need?” B: “The beaker and the timer so we can record the reaction.”',
                      vietnamese: 'A: “Chúng ta cần dụng cụ nào?” B: “Cốc đong và đồng hồ bấm giờ để ghi lại phản ứng.”'
                    }
                  : {
                      english: 'Write a short practice dialogue for this lesson.',
                      vietnamese: 'Viết đoạn hội thoại ngắn để luyện nói.'
                    }
            }
          };
        })
      };
    })
  }
];
