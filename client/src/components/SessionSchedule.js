import React, { useState } from 'react';

function SessionSchedule({ onScheduleSubmit }) {
    const [sessions, setSessions] = useState(['']);

    const handleAddSession = () => {
        setSessions([...sessions, '']);
    };

    const handleSessionChange = (index, value) => {
        const newSessions = [...sessions];
        newSessions[index] = value;
        setSessions(newSessions);
    };

    const handleSubmit = () => {
        onScheduleSubmit(sessions);
    };

    return (
        <div>
            <h3>Manually Add Sessions</h3>
            {sessions.map((session, index) => (
                <input
                    key={index}
                    value={session}
                    onChange={(e) => handleSessionChange(index, e.target.value)}
                    placeholder={`Session ${index + 1}`}
                />
            ))}
            <button onClick={handleAddSession}>Add Another Session</button>
            <button onClick={handleSubmit}>Submit Schedule</button>
        </div>
    );
}

export default SessionSchedule;
