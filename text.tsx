import { useEffect, useState } from "react";

interface StudentItem {
    student_id: string;
    student_firstName: string;
    student_lastName: string;
    class_id: number;
    group_id: number;
  }
  const [studentList, setStudentList] = useState<StudentItem[]>([]);

  // later, delete this code (useEffect) when you work on database
  // when you fill studentList from there
  // delete just useEffect, because you need studentList and setStudentList variables ⚠
  useEffect(() => {
    const initialStudentList: StudentItem[] = [
      {
        student_id: '1',
        student_firstName: 'Leila',
        student_lastName: 'Kasmi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '2',
        student_firstName: 'Chourrouk',
        student_lastName: 'Saadi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '3',
        student_firstName: 'Ikram',
        student_lastName: 'Batouche',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '4',
        student_firstName: 'Nafissa',
        student_lastName: 'Belaroug',
        class_id: 6,
        group_id: 9,
      },
    ];
    setStudentList(initialStudentList);
  }, []);

  const checkAttendance= false;
  // this variable checkAttendance for achieve if prof check Attendance or no 