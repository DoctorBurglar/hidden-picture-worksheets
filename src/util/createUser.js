// import { useAuth0 } from "@auth0/auth0-react";

// export const createNewUser = async (setClassroomCode) => {
//   const { getAccessTokenSilently } = useAuth0();

//   try {
//     const token = await getAccessTokenSilently();

//     const result = await fetch("https://hidden-picture-worksheets-api.herokuapp.com/auth/create-user", {
//       method: "post",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const resData = await result.json();
//     console.log(resData);
//     setClassroomCode(resData.classroomCode);
//   } catch (err) {
//     console.log(err);
//   }
// };
