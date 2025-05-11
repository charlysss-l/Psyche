import React, { useEffect, useState } from "react";
import style from "./psychologyuser.module.scss";
import backendUrl from "../../config";

//Handles fetching, editing, deleting, and searching for users.
interface User {  
  userId: string;
  studentNumber: string;
  email: string;
  role: string;
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>(""); // To track success message
  const [errorMessage, setErrorMessage] = useState<string>(""); // To track error message

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/allusers/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, role: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/allusers/users/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );
      if (response.ok) {
        setUsers(users.filter((user) => user.userId !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async () => {
    if (editUser) {
      try {
        const response = await fetch(`${backendUrl}/api/allusers/users/${editUser.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: editUser.email,
            studentNumber: editUser.studentNumber,
            role: editUser.role,
          }),
        });
  
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.userId === editUser.userId ? editUser : user
            )
          );
          setSaveStatus("User saved successfully!");
          setErrorMessage("");
          setEditUser(null);
  
          // Remove message after 3 seconds
          setTimeout(() => {
            setSaveStatus(""); // Clear success message after 3 seconds
          }, 3000);
        } else {
          setSaveStatus("");
          setErrorMessage("Failed to save user. Please try again.");
  
          // Remove error message after 3 seconds
          setTimeout(() => {
            setErrorMessage(""); // Clear error message after 3 seconds
          }, 3000);
        }
      } catch (error) {
        console.error("Error saving user:", error);
        setSaveStatus("");
        setErrorMessage("An error occurred while saving the user. Please try again.");
  
        // Remove error message after 3 seconds
        setTimeout(() => {
          setErrorMessage(""); // Clear error message after 3 seconds
        }, 3000);
      }
    }
  };
  

  const filteredUsers = users.filter((user) =>
    [user.userId, user.studentNumber, user.email]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  return (
    <div className={style.userContainer}>
      <h2 className={style.userTitle}>List of Users</h2>
      <p className={style.userCount}>Total Users: {filteredUsers.length}</p>
      <div className={style.searchInputContainer}>
        <input
          type="text"
          placeholder="Search by User ID, Student Number, or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchInput}
        />
      </div>
  
      {/* Display Success/Error Messages Outside of the Modal */}
      {saveStatus && <div className={style.successMessage}>{saveStatus}</div>}
      {errorMessage && <div className={style.errorMessage}>{errorMessage}</div>}
  
      <div className={style.responsesWrapper}>
        <table className={style.tableUser}>
          <thead>
            <tr>
              <th className={style.th}>User ID</th>
              <th className={style.th}>Student Number</th>
              <th className={style.th}>Email</th>
              <th className={style.th}>Role</th>
              <th className={style.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td className={style.td}>{user.userId}</td>
                  <td className={style.td}>{user.studentNumber || "N/A"}</td>
                  <td className={style.td}>{user.email}</td>
                  <td className={style.td}>{user.role}</td>
                  <td className={style.td}>
                    <button
                      className={`${style["button-action"]} ${style["edit"]}`}
                      onClick={() => setEditUser(user)}
                    >
                      Edit
                    </button>
                    {user.role === "Student" && (
                      <button
                        className={`${style["button-action"]} ${style["delete"]}`}
                        onClick={() => handleDelete(user.userId, user.role)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={style.td}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {editUser && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h3>Edit User</h3>
            <div className={style.modaleditinfo}>
              <label>User ID: </label>
              <input className={style.userIdedit} type="text" value={editUser.userId} readOnly />
            </div>
            <div className={style.modaleditinfo}>
              <label>Email: </label>
              <input
                className={style.emailedit}
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser((prev) => prev && { ...prev, email: e.target.value })
                }
              />
            </div>
            <div className={style.modaleditinfo}>
              <label>Student Number: </label>
              <input
                className={style.studnumedit}
                type="text"
                value={editUser.studentNumber}
                onChange={(e) =>
                  setEditUser((prev) => prev && { ...prev, studentNumber: e.target.value })
                }
              />
            </div>
  
            <div className={style.modalActions}>
              <button onClick={handleSave} className={style.saveButton}>
                Save
              </button>
              <button onClick={() => setEditUser(null)} className={style.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  

export default User;
