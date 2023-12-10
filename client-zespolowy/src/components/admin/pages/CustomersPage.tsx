import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

export const CustomersPage = observer(() => {
    const { userStore } = useStore();
    const {users} = userStore;

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                {user.id}, {user.email}, {user.userName}
                </div>
            ))}
        </div>
    );
    });