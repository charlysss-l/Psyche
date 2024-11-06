import React from 'react'
import style from './page.module.scss'
const User = () => {
  return (
    <div>
    <h2 className={style.userTitle}>List of Users</h2>
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