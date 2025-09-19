import Button from "@mui/material/Button"
import defaultAvatar from "../assets/default-avatar.jpg"
import { useEffect, useState } from "react";
import api from "../services/config.services";

export interface IUser {
    _id: string,
    email: string;
    password: string;
    username: string;
    name: string;
    profilePicture: string;
    friends?: IUser[]
}

function UserProfilePage() {
    const [userData, setUserData] = useState<IUser | null>(null);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const response = await api.get('/user');
            console.log("user data", response)
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="central-container w-[70%] p-2 flex flex-col justify-center items-center m-auto gap-6">
                <div className="user-data flex justify-center">
                    <h1 className="text-4xl">{userData?.name}</h1>
                </div>

                <div className="picture-box flex flex-col items-center gap-5 w-fit ">
                    <div className="profile-picture">
                        <img src={userData?.profilePicture ? userData?.profilePicture : defaultAvatar} alt="User profile image" className="max-w-[300px] border-1 border-slate-500 aspect-square rounded-full object-cover" />
                    </div>
                </div>
            </div>

        </>
    )
}
export default UserProfilePage
