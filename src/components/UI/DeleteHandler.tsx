import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../config/firebaseConfig";
import { ConfirmModal } from "./ConfirmModal";

interface DeleteHandlerProps {
    itemId: string | null;
    collectionName: string;
    onSuccessfulDelete: (itemId: string) => void;
    onCancelDelete?: () => void;
    children: (handleDelete: (itemId: string) => void) => React.ReactNode;
    confirmMessage?: string;
}

export const DeleteHandler: React.FC<DeleteHandlerProps> = ({
                                                                collectionName,
                                                                onSuccessfulDelete,
                                                                onCancelDelete,
                                                                children,
                                                                confirmMessage = "Are you sure you want to delete this item?",
                                                            }) => {
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteDoc(doc(db, collectionName, itemToDelete));
            toast.success(`Item successfully removed.`, {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });

            onSuccessfulDelete(itemToDelete);
        } catch (error) {
            console.error(`Error deleting item from ${collectionName}:`, error);
            toast.error(`Failed to delete item. Please try again.`, {
                position: "top-center",
                closeOnClick: true,
                theme: "dark",
            });
        }
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setItemToDelete(null);
        if (onCancelDelete) {
            onCancelDelete();
        }
    };

    return (
        <>
            {children(handleDelete)}

            {showConfirm && (
                <ConfirmModal
                    message={confirmMessage}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </>
    );
};