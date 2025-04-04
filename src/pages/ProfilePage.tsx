import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faCameraRetro,
    faCircleCheck,
    faHeadset,
    faRightFromBracket,
    faStar,
    faSwatchbook
} from "@fortawesome/free-solid-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { auth } from "../config/firebaseConfig.ts";

export const Profile: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [userPhoto, setUserPhoto] = useState<string | null>(user?.photoURL || null);
    const [newUsername, setNewUsername] = useState<string>(user?.displayName || '');
    const [editUsername, setEditUsername] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    // Handles uploading the file to Firebase and updating the user profile
    const handleImageUpload = async (file: File) => {
        if (!user) return;
        try {
            const storage = getStorage();
            const fileName = `profilePhotos/${user.uid}`;
            const storageRef = ref(storage, fileName);

            // Delete existing photo if it exists
            try {
                await deleteObject(storageRef);
            } catch (deleteError) {
                console.log("No existing photo to delete", deleteError);
            }

            // Upload the new file using its type as contentType
            await uploadBytes(storageRef, file, { contentType: file.type });
            // Get the download URL and update the user's profile
            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL });
            setUserPhoto(photoURL);
            toast.success("Profile photo updated!", {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        } catch (error) {
            console.error("Error updating photo:", error);
            toast.error("Failed to update the photo. Please try again.");
        }
    };

    const toggleEditUsername = () => {
        if (!editUsername) {
            setNewUsername(user?.displayName || '');
        }
        setEditUsername(prev => !prev);
    };

    const handleUsernameChange = async () => {
        if (!user) return;

        if (newUsername.trim() !== (user?.displayName?.trim() || '')) {
            try {
                await updateProfile(user, { displayName: newUsername });
                setEditUsername(false);
            } catch (error) {
                console.error("Error updating username:", error);
                toast.error("Failed to update username. Please try again.");
                return;
            }
        }

        setEditUsername(false);
    };

    const creationTime = user?.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : null;
    const formattedCreationTime = creationTime
        ? creationTime.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown";

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return;

    return (
        <div className="w-11/12 mx-auto flex flex-col items-center justify-center md:mt-8 max-md:mt-16 font-Josefin">
            {/* Profile information */}
            <div className="flex flex-col items-center justify-center gap-4">
                {/* Profile Photo */}
                <label className="cursor-pointer">
                    {user?.photoURL || userPhoto ? (
                        <img
                            alt="Profile Photo"
                            src={userPhoto ?? user?.photoURL ?? undefined}
                            className="w-32 h-32 border rounded-full border-secondary dark:border-primary object-cover"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faCameraRetro} />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>

                {/* Username */}
                <div className="gap-1 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        {editUsername ?
                            <div className="flex items-center justify-center gap-2">
                                <input
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="text-secondary px-2 py-1 rounded"
                                />
                                <button onClick={handleUsernameChange}>
                                    <FontAwesomeIcon icon={faCircleCheck}/>
                                </button>
                            </div>
                        :
                        <button
                            onClick={toggleEditUsername}
                        >
                            <span className="text-secondary dark:text-primary text-center text-xl font-semibold uppercase tracking-widest">
                                {user.displayName || `User ${user.uid}`}
                            </span>
                        </button>
                        }
                    </div>
                    <span className="text-center text-secondary/80 dark:text-primary/80 uppercase text-xs tracking-wider">
                        {formattedCreationTime}
                    </span>
                </div>
            </div>

            {/* Profile Settings */}
            <div className="w-11/12 mx-auto gap-2 flex flex-col mt-8">
                {/* Preferences Section */}
                <div className="border-b border-secondary/20 dark:border-primary/20">
                    <p className="text-secondary/60 dark:text-primary/60 text-xs uppercase tracking-wider">
                        Preferences
                    </p>
                    <div className="px-1">
                        <button type="button" className="py-4 w-full flex flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faBell} />
                            <span className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Notifications
                            </span>
                        </button>
                        <button type="button" className="py-4 w-full flex flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faSwatchbook} />
                            <span className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Appearance
                            </span>
                        </button>
                    </div>
                </div>

                {/* Resources Section */}
                <div>
                    <p className="text-secondary/60 dark:text-primary/60 text-xs uppercase tracking-wider">
                        Resources
                    </p>
                    <div className="px-1">
                        <button type="button" className="py-4 w-full flex flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faHeadset} />
                            <span className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Support
                            </span>
                        </button>
                        <button type="button" className="py-4 w-full flex flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faStar}/>
                            <span className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Rate Us
                            </span>
                        </button>
                        <button type="button" className="py-4 w-full flex flex-row items-center gap-4">
                            <FontAwesomeIcon icon={faXTwitter}/>
                            <span className="text-secondary dark:text-primary lowercase tracking-wide text-xl">
                                Follow Us
                            </span>
                        </button>
                    </div>
                </div>

                {/* Sign Out Section */}
                <div className="px-1 my-2">
                    <button type="button" onClick={handleLogout}
                            className="py-4 w-full flex flex-row items-center gap-4">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span className="text-secondary dark:text-primary lowercase tracking-wider text-xl">
                            Sign Out
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
