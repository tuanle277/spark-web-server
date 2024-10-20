import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, collectionGroup } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';  // Firebase Firestore and Storage initialization
import '../classes.css'

function Classes({ professorId }) {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newSessionTitle, setNewSessionTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [syllabusFile, setSyllabusFile] = useState(null);

    // const navigate = useNavigate();  // Initialize useNavigate hook

    // Fetch classes for the professor
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);  // Show spinner before fetching data
            try {
                const classSnapshot = await getDocs(collectionGroup(db, 'classes'));

                const classList = classSnapshot.docs.length > 0
                    ? classSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    : []; console.log("There is no classes"); // or handle the empty case differently
                setClasses(classList);
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);  // Hide spinner after fetching is done
            }
        };

        fetchClasses();
    }, [professorId]);

    // Fetch sessions for a selected class
    const handleClassSelect = async (classId) => {
        setLoading(true);  // Show spinner before fetching sessions
        try {
            const sessionsRef = collection(db, `professors/${professorId}/classes/${classId}/sessions`);
            const sessionSnapshot = await getDocs(sessionsRef);
            const sessionList = sessionSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSelectedClass(classId);
            setSessions(sessionList);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);  // Hide spinner after fetching
        }
    };

    // Add a new session to the selected class
    const handleAddSession = async () => {
        if (!newSessionTitle) return;
        setLoading(true);  // Show spinner before fetching materials
        try {
            const sessionsRef = collection(db, `professors/${professorId}/classes/${selectedClass}/sessions`);
            await addDoc(sessionsRef, {
                session_title: newSessionTitle
            });
            setNewSessionTitle('');
            // Refetch sessions after adding a new one
            handleClassSelect(selectedClass);
        }
        catch (error) {
            console.error('Error adding session:', error);
        } finally {
            setLoading(false);  // Hide spinner after fetching
        }
    };

    // Fetch materials for a selected session
    const handleSessionSelect = async (sessionId) => {
        setLoading(true);  // Show spinner before fetching materials
        try {
            const materialsRef = collection(db, `professors/${professorId}/classes/${selectedClass}/sessions/${sessionId}/materials`);
            const materialSnapshot = await getDocs(materialsRef);
            const materialList = materialSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSelectedSession(sessionId);
            setMaterials(materialList);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);  // Hide spinner after fetching
        }
    };

    // Handle syllabus upload
    const handleSyllabusUpload = async (file) => {
        if (!file || !selectedClass) return;
        setLoading(true);
        try {
            const syllabusRef = ref(storage, `professors/${professorId}/classes/${selectedClass}/syllabus/${file.name}`);
            const uploadTask = uploadBytesResumable(syllabusRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Syllabus upload failed:', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const classDocRef = doc(db, `professors/${professorId}/classes/${selectedClass}`);
                    await addDoc(classDocRef, { syllabus_url: downloadURL });

                    alert('Syllabus uploaded successfully!');
                    setUploadProgress(0); // Reset progress bar after upload
                }
            );
        } catch (error) {
            console.error('Error uploading syllabus:', error);
        } finally {
            setLoading(false);
        }
    };

    // Upload material for a session
    const uploadMaterialForSession = async (file) => {
        if (!file || !selectedClass || !selectedSession) return;
        setLoading(true);

        // Create a reference to the file in Firebase Storage
        const materialRef = ref(storage, `professors/${professorId}/classes/${selectedClass}/sessions/${selectedSession}/materials/${file.name}`);

        // Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(materialRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress); // Update progress state
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            async () => {
                // Get the download URL of the uploaded file
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('Material available at:', downloadURL);

                // Store the download URL in Firestore under the selected session
                const materialsRef = collection(db, `professors/${professorId}/classes/${selectedClass}/sessions/${selectedSession}/materials`);
                await addDoc(materialsRef, {
                    material_title: file.name,  // Store the file name
                    material_url: downloadURL,  // Store the file download URL (material_url)
                });

                alert('Material uploaded successfully!');
                handleSessionSelect(selectedSession); // Refetch materials after uploading
                setUploadProgress(0); // Reset progress bar after upload
            }
        );

    };

    // Function to fetch files from a specific Firebase Storage path
    const getFiles = async (storagePath) => {
        setLoading(true);
        try {
            const listRef = ref(storage, storagePath);
            const result = await listAll(listRef); // List all items in the folder

            const files = await Promise.all(result.items.map(async (itemRef) => {
                const fileUrl = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    url: fileUrl,
                };
            }));

            setSyllabusFiles(files); // Store the files in the state
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };


    // ================================ UI starts here ===================================

    return (
        <div className="container">
            <h2>Your Classes</h2>
            {/* Back button */}
            {/* <button onClick={() => navigate(-1)} className="back-button">Back</button> */}

            {loading && <p>Loading...</p>}

            {loading && (
                <div className="spinner">
                    <div></div><div></div><div></div>
                </div>
            )}

            {!selectedClass && (
                <ul>
                    {classes.map((c) => (
                        <li key={c.id}>
                            <button onClick={() => handleClassSelect(c.id)}>
                                {c.class_name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Class page with session and materials */}
            {selectedClass && (
                <div>
                    <h3>Class: {selectedClass}</h3>

                    <div>
                        <h4>Upload Syllabus</h4>
                        <input type="file" onChange={(e) => handleSyllabusUpload(e.target.files[0])} />
                        <div className="progress">
                            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <h4>Add New Session</h4>
                        <input
                            type="text"
                            value={newSessionTitle}
                            onChange={(e) => setNewSessionTitle(e.target.value)}
                            placeholder="Enter session title"
                        />
                        <button onClick={handleAddSession}>Add Session</button>
                    </div>

                    <h4>Sessions</h4>
                    {sessions.length > 0 ? (
                        <ul>
                            {sessions.map((session) => (
                                <li key={session.id}>
                                    <button onClick={() => handleSessionSelect(session.id)}>
                                        {session.session_title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No sessions available for this class.</p>
                    )}

                    {selectedSession && (
                        <div>
                            <h5>Materials</h5>
                            {materials.length > 0 ? (
                                <ul>
                                    {materials.map(material => (
                                        <li key={material.id}>
                                            <a href={material.material_url} target="_blank" rel="noopener noreferrer">
                                                {material.material_title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No materials for this session.</p>
                            )}

                            <h5>Upload Material</h5>
                            <input type="file" onChange={(e) => uploadMaterialForSession(e.target.files[0])} />
                            <div className="progress">
                                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Classes;
