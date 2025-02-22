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

  const [modalType, setModalType] = useState<"create" | "edit" | null>(null); // New state to manage modal type
  const [selectedUser, setSelectedUser] = useState<UserGuidance | null>(null);
  const [mainUserCount, setMainUserCount] = useState(0);

  useEffect(() => {
    generateUniqueUserId();
  }, []);

  const generateRandomUserId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
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
          setUsers(data);

          const count = data.filter(
            (user: { role: string }) => user.role === "main"
          ).length;
          setMainUserCount(count);
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
        setError(
          "Email already exists. Please log in or use a different email."
        );
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
    console.log("Submitting user data:", {
      email,
      fullName,
      password,
      role,
      userId,
    });

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/authGuidance/delete/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

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
    setModalType("edit"); // Open the Edit modal
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
        setModalType(null); // Close the modal after success
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
      <h1 className={styles.mainHeading}>Create Guidance Account</h1>
      <p className={styles.userCount}>Total Guidance Account: {filteredUsers.length}</p>
      <button
        className={styles.addGuidanceButton}
        onClick={() => {
          setModalType("create"); // Open the Create Account modal
        }}
      >
        Add Guidance
      </button>

      {/* Conditional rendering based on modalType */}
      {modalType === "create" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.create_h2}>Create Account</h2>
            <form onSubmit={handleSubmit} className={styles.signup_form}>
              <div>
                <label className={styles.createlabel}>
                  Email: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.createInput}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={styles.createlabel}>
                  Full Name: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.createInput}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className={styles.createlabelRole}>
                  Role: <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.createInputRole}
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
                <p className={styles.notecreate}>
                  Note: Default Password is 123 and can be changed once account
                  created
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button type="submit" className={styles.createsubmitButton}>
                  Create Account
                </button>
                <button
                  className={styles.cancelcreateButton}
                  onClick={() => setModalType(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </div>
      )}

      {/* Modal for Editing User */}
      {modalType === "edit" && selectedUser && (
        <div className={styles.editmodal}>
          <div className={styles.editmodalContent}>
            <h2 className={styles.edit_h2}>Edit User</h2>
            <form onSubmit={handleEditSubmit} className={styles.signup_form}>
              <div>
                <label className={styles.editlabel}>
                  Full Name: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.editInput}
                  type="text"
                  value={selectedUser.fullName}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className={styles.editlabel}>
                  Email: <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.editInput}
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {(mainUserCount === 2 || selectedUser.role === "sub") && (

              <div>
                <label className={styles.editlabel}>
                  Role: <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.editInputRole}
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Role</option>
                  <option value="sub">Sub Guidance</option>
                  <option value="main">Main Guidance</option>
                </select>
              </div>
              )}
              
              <div className={styles.modalFooter}>
                <button type="submit" className={styles.updateButton}>
                  Update User
                </button>
                <button
                  className={styles.cancelupdateButton}
                  onClick={() => setModalType(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </div>
      )}

      {/* User List */}
      <div className={styles.usersList}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchGuidance}
        />
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateAccount;
