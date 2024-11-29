import React, { useEffect, useState } from "react";
import style from "./psychologyuser.module.scss";

interface User {
  userId: string;
  studentNumber: string;
  email: string;
  role: string;
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/allusers/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, role: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/allusers/users/${userId}`,
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

  const handleEdit = async (userId: string, email: string, role: string) => {
    const newEmail = prompt("Enter new email:", email);
    if (newEmail && newEmail !== email) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/allusers/users/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newEmail, role }),
          }
        );
        if (response.ok) {
          setUsers(
            users.map((user) =>
              user.userId === userId ? { ...user, email: newEmail } : user
            )
          );
        }
      } catch (error) {
        console.error("Error editing user:", error);
      }
    }
  };

  return (
    <div>
      <h2 className={style.userTitle}>LIST OF USERS</h2>
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
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId}>
                <td className={style.td}>{user.userId}</td>
                <td className={style.td}>{user.studentNumber}</td>
                <td className={style.td}>{user.email}</td>
                <td className={style.td}>{user.role}</td>
                <td className={style.td}>
                  <button
                    className={`${style["button-action"]} ${style["edit"]}`}
                    onClick={() =>
                      handleEdit(user.userId, user.email, user.role)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className={`${style["button-action"]} ${style["delete"]}`}
                    onClick={() => handleDelete(user.userId, user.role)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={style.td}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default User;
