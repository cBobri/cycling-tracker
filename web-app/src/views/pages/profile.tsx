import { useUserContext } from "../../userContext";

const Profile = () => {
    const context = useUserContext();

    return (
        <div className="py-6 px-6 xl:px-2 max-w-screen-xl mx-auto">
            <h1>Profile</h1>
            <p>{context.user?.username}</p>
            <p>{context.user?.email}</p>
            <p>{context.user?.weight}</p>
            <p>{context.user?.bikeWeight}</p>
        </div>
    );
};

export default Profile;
