import React, { useEffect } from 'react';
import Classes from './components/Classes';
import DummySignIn from './DummySignIn';

import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';  // Make sure to import your Firestore configuration

async function generateSampleData() {
    try {
        // Array of sample professors, classes, sessions, and materials data
        const professorsData = [
            {
                professor_name: "John Doe",
                classes: [
                    {
                        class_name: "Physics 101",
                        sessions: [
                            {
                                session_title: "Introduction to Physics",
                                materials: [
                                    {
                                        file_name: "lecture_1.pdf",
                                        file_url: "https://example.com/lecture_1.pdf"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        class_name: "Math 101",
                        sessions: [
                            {
                                session_title: "Introduction to Algebra",
                                materials: [
                                    {
                                        file_name: "algebra_lecture_1.pdf",
                                        file_url: "https://example.com/algebra_lecture_1.pdf"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                professor_name: "Jane Smith",
                classes: [
                    {
                        class_name: "Chemistry 101",
                        sessions: [
                            {
                                session_title: "Introduction to Chemistry",
                                materials: [
                                    {
                                        file_name: "chemistry_lecture_1.pdf",
                                        file_url: "https://example.com/chemistry_lecture_1.pdf"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        // Loop through each professor and add them to Firestore
        for (const professor of professorsData) {
            const professorRef = await addDoc(collection(db, 'professors'), {
                professor_name: professor.professor_name,
            });

            // Loop through each class for the professor and add to Firestore
            for (const classItem of professor.classes) {
                const classRef = await addDoc(
                    collection(db, `professors/${professorRef.id}/classes`),
                    {
                        class_name: classItem.class_name,
                    }
                );

                // Loop through each session for the class and add to Firestore
                for (const session of classItem.sessions) {
                    const sessionRef = await addDoc(
                        collection(db, `professors/${professorRef.id}/classes/${classRef.id}/sessions`),
                        {
                            session_title: session.session_title,
                        }
                    );

                    // Loop through each material for the session and add to Firestore
                    for (const material of session.materials) {
                        await addDoc(
                            collection(db, `professors/${professorRef.id}/classes/${classRef.id}/sessions/${sessionRef.id}/materials`),
                            {
                                file_name: material.file_name,
                                file_url: material.file_url,
                            }
                        );
                    }
                }
            }
        }

        console.log("Sample data generated successfully!");
    } catch (error) {
        console.error("Error generating sample data: ", error);
    }
}

function App() {
    const professorId = 'professor_001'; // Replace with actual professor ID from authentication

    return (
        <div className="App">
            <h1>Professor Dashboard</h1>
            {/* <DummySignIn /> */}
            <Classes professorId={professorId} />
        </div>
    );
}

export default App;

