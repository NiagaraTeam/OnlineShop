import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import { User } from "../../../app/models/common/User";

export const CustomersPage = observer(() => {
    const { userStore } = useStore();
    const { getUsers } = userStore
    const [users] = useState<User[]>([])

    useEffect(() => {
        getUsers(); 
    }, []);

    return (
        <div>
            <button onClick={getUsers}>Load Users</button>
        {users.map(user => (
            <div key={user.id}>
            {user.id}, {user.email}, {user.userName}
            </div>
        ))}
        </div>
    );
    });