import { useState } from "react";
import { courses } from "./data/courses";
import { Home } from "./components/Home";
import { InstructorGameView } from "./components/InstructorGameView";
import { LessonView } from "./components/LessonView";
import { PracticeView } from "./components/PracticeView";
import { PuzzleView } from "./components/PuzzleView";

type View =
  | { name: "home" }
  | { name: "lesson"; courseId: string; lessonIndex: number }
  | { name: "practice"; courseId: string }
  | { name: "instructor" }
  | { name: "puzzles" };

function App() {
  const [view, setView] = useState<View>({ name: "home" });

  if (view.name === "lesson") {
    const course = courses.find((c) => c.id === view.courseId)!;
    return (
      <LessonView
        course={course}
        lessonIndex={view.lessonIndex}
        onExit={() => setView({ name: "home" })}
        onNextLesson={() =>
          setView(
            view.lessonIndex + 1 < course.lessons.length
              ? { name: "lesson", courseId: course.id, lessonIndex: view.lessonIndex + 1 }
              : { name: "home" }
          )
        }
      />
    );
  }

  if (view.name === "practice") {
    const course = courses.find((c) => c.id === view.courseId)!;
    return <PracticeView course={course} onExit={() => setView({ name: "home" })} />;
  }

  if (view.name === "instructor") {
    return <InstructorGameView onExit={() => setView({ name: "home" })} />;
  }

  if (view.name === "puzzles") {
    return <PuzzleView onExit={() => setView({ name: "home" })} />;
  }

  return (
    <Home
      onStartLesson={(courseId, lessonIndex) => setView({ name: "lesson", courseId, lessonIndex })}
      onStartPractice={(courseId) => setView({ name: "practice", courseId })}
      onStartInstructor={() => setView({ name: "instructor" })}
      onStartPuzzles={() => setView({ name: "puzzles" })}
    />
  );
}

export default App;
