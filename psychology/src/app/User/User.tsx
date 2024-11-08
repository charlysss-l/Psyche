import React from 'react'
import style from './psychologyuser.module.scss'
const User = () => {
  return (
    <div>
    <h2 className={style.userTitle}>LIST OF USERS</h2>
    <table className={style.table}>
        <thead>
            <tr>
                <th className={style.th}>User ID</th>
                <th className={style.th}>Username</th>
                <th className={style.th}>Role</th>
            </tr>
        </thead>
        <tbody>

                        <tr>
                            <td className={style.td}></td>
                            <td className={style.td}></td>
                            <td className={style.td}></td>
                        </tr>

        </tbody>
    </table>
</div>
  )
}

export default User