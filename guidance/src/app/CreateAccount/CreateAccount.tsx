import React, { useState, useEffect } from "react";
import styles from "./CreateAccount.module.scss";
import backendUrl from "../../config";

interface UserGuidance {
  email: string;
  fullName: string;
  password: string;
  role: string;
  userId: string;
}

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [users, setUsers] = useState<UserGuidance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserGuidance | null>(null);
  const [mainUserCount, setMainUserCount] = useState(0); // To track count of 'main' users

  


  useEffect(() => {
    generateUniqueUserId();
    
  }, []);

  const generateRandomUserId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const checkUserIdExists = async (id: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/authGuidance/guidance/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        return !!data;
      }
    } catch (error) {
      console.error("Error checking User ID:", error);
    }
    return false;
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/authGuidance/guidance`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data);

        // Count users with role 'main'
        const count = data.filter((user: { role: string; }) => user.role === 'main').length;
        setMainUserCount(count); // Set the count of 'main' users
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const generateUniqueUserId = async () => {
    let uniqueId = "";
    let isUnique = false;
    while (!isUnique) {
      uniqueId = generateRandomUserId();
      isUnique = !(await checkUserIdExists(uniqueId));
    }
    setUserId(uniqueId);
    console.log("Generated userId:", uniqueId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is still being generated. Please wait.");
      return;
    }

    if (!email || !name || !role) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    const password = "123"; // Default password

    try {
      const response = await signupUser(email, name, password, role, userId);

      console.log(response);

      if (response.message === "sub account created successfully") {
        window.alert("Account created successfully.");
        window.location.reload();
      } else if (response.error === "email_exists") {
        setError("Email already exists. Please log in or use a different email.");
      } else if (response.error === "userId_exists") {
        setError("User ID already exists. Please refresh the page.");
      }
    } catch (error) {
      setError("Sign up failed. Please try again later.");
      console.error(error);
    }
  };

  const signupUser = async (
    email: string,
    fullName: string,
    password: string,
    role: string,
    userId: string
  ) => {
    console.log("Submitting user data:", { email, fullName, password, role, userId });

    const response = await fetch(
      `${backendUrl}/api/authGuidance/subGuidance/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, password, role, userId }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    return data;
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return; // Exit if user cancels
  
    try {
      const response = await fetch(`${backendUrl}/api/authGuidance/delete/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
  
      if (response.ok) {
        setUsers(users.filter((user) => user.userId !== userId));
        alert("User deleted successfully!");
      } else {
        const errorMessage = await response.text();
        alert(`Failed to delete user: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user. Please try again.");
    }
  };
  

  const handleEdit = (user: UserGuidance) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const { email, fullName, role, userId } = selectedUser;

    try {
      const response = await fetch(
        `${backendUrl}/api/authGuidance/update/guidance/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName, role }),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user.userId === userId ? { ...user, ...updatedUser } : user
          )
        );
        setIsEditModalOpen(false);
        alert("User updated successfully!");
      } else {
        alert("Error updating user.");
      }
    } catch (error) {
      console.error("Error editing user:", error);
      alert("An error occurred while updating the user.");
    }
  };
  
  

  const filteredUsers = users.filter((user) =>
    [user.userId, user.fullName, user.email]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.mainContainer}>
    {/* Sign Up Container */}
      <div className={styles.signup_container}>
        <h2 className={styles.signup_h2}>Create Account</h2>
        <form onSubmit={handleSubmit} className={styles.signup_form}>
          <div>
            <label className={styles.signuplabel}>
              Email: <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.signupInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Full Name: <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.signupInput}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Role: <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.signupInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="sub">Sub Guidance</option>
              <option value="main">Main Guidance</option>
            </select>
          </div>
          <div>
            <p style={{ color: "red", textAlign: "center" }}>
              Note: Default Password is 123 and can be changed later through their profile.
            </p>
          </div>
          <div>
            <input
              className={styles.hidden}
              type="text"
              value={userId}
              readOnly
            />
          </div>
          <button type="submit" className={styles.signupSubmit}>
            Create
          </button>
        </form>
      </div>

    {/* User List Container */}
    <div className={styles.userListContainer}>
    <h2 className={styles.userTitle}>LIST OF USERS</h2>
    <p className={styles.userCount}>Total Users: {filteredUsers.length}</p>

      <input
        type="text"
        placeholder="Search by User ID, Name, or Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.responsesWrapper}>

      <table className={styles.tableUser}>
        <thead>
          <tr>
            <th className={styles.th}>User ID</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td className={styles.td}>{user.userId}</td>
                <td className={styles.td}>{user.fullName} </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>{user.role}</td>
                <td className={styles.td}>
                  <button
                    className={`${styles["button-action"]} ${styles["edit"]}`}
                    onClick={() =>
                      handleEdit(user)
                    }
                  >
                    Edit
                  </button>
                  {(mainUserCount === 2 || user.role === "sub") && (
                  <button
                    className={`${styles["button-action"]} ${styles["delete"]}`}
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                )}

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.td}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>

       {/* Edit Modal */}
       {isEditModalOpen && selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <form onSubmit={handleEditSubmit}>
              <h3>Edit User</h3>
              <label>Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <label>Full Name:</label>
              <input
                type="text"
                value={selectedUser.fullName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, fullName: e.target.value })
                }
              />
             {selectedUser.role === "sub" && (
                <>
                  <label>Role:</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                  >
                    <option value="sub">Sub Guidance</option>
                    <option value="main">Main Guidance</option>
                  </select>
                </>
              )}


              <button type="submit">Update</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default CreateAccount;
