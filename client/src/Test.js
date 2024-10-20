import { collection, getDocs, doc } from "firebase/firestore";
import { db } from './firebaseConfig';

const fetchTestData = async () => {
    try {
        const professorRef = doc(db, "professors", "professor_001");
        const classesCollection = collection(professorRef, "classes"); // Reference to the subcollection
        const querySnapshot = await getDocs(classesCollection);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Error fetching test data: ", error);
    }
};

function Test() {
    fetchTestData();
}

export default Test;