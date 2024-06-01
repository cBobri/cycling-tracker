import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserDetails } from "./api/auth";
import { UserDetails } from "./Types";

interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContextType {
    user: UserDetails | null;
    setUserData: (data: UserDetails | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }

    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserDetails | null>(null);

    const setUserData = (data: UserDetails | null) => {
        setUser(data);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetchUserDetails();

            if (response?.error) {
                localStorage.removeItem("token");
                return;
            }

            setUserData(response.data);
        };

        const token = localStorage.getItem("token");

        if (token) {
            fetchUser();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
