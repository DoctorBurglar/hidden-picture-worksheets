import React, { useState, useEffect } from "react";
import { Button, Box, Input, Heading, Spinner } from "@chakra-ui/core";
import Header from "../../components/common-components/Header/Header";
import classes from "./Classrooms.module.css";
import ClassroomPreview from "../../components/classrooms-components/ClassroomPreview/ClassroomPreview";
import Classroom from "../../components/classrooms-components/Classroom/Classroom";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";

const Classrooms = () => {
  const [classroomInput, setClassroomInput] = useState({
    name: "",
  });

  const [classrooms, setClassrooms] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState({
    newClassroom: false,
    deleteCheck: false,
    code: false,
  });

  const [activeClassroom, setActiveClassroom] = useState({});

  const [deleting, setDeleting] = useState(false);

  const [codeToDisplay, setCodeToDisplay] = useState({ code: "", name: "" });

  const [classroomToDeleteId, setClassroomToDeleteId] = useState("");

  useEffect(() => {
    let mounted = true;
    const getClassrooms = async () => {
      try {
        const result = await axios.get("/get-classrooms");
        console.log(result);
        if (mounted) {
          setClassrooms(result.data.classrooms);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getClassrooms();
    return () => (mounted = false);
  }, []);

  const inputHandler = (event) => {
    setClassroomInput({
      ...classroomInput,
      [event.target.name]: event.target.value,
    });
  };

  const createClassroomHandler = async () => {
    try {
      const result = await axios.post("/create-classroom", {
        data: {
          name: classroomInput.name,
        },
      });
      console.log(result);
      const updatedClassrooms = [...classrooms];
      updatedClassrooms.push(result.data.classroom);
      setClassrooms(updatedClassrooms);
      setModalIsOpen({ ...modalIsOpen, newClassroom: false });
    } catch (err) {
      console.log(err);
    }
  };

  const openClassroomHandler = (classroom) => {
    setActiveClassroom(classroom);
  };

  const openCodeModalHandler = (event, code, name) => {
    event.stopPropagation();
    setCodeToDisplay({ code, name });
  };

  const deleteCheckHandler = (event, id) => {
    event.stopPropagation();
    setClassroomToDeleteId(id);
  };

  const deleteClassroomHandler = async () => {
    console.log(classroomToDeleteId, activeClassroom._id);
    if (activeClassroom._id === classroomToDeleteId) {
      setActiveClassroom({});
    }
    setDeleting(true);
    try {
      const result = await axios.delete("/delete-classroom", {
        data: {
          classroomId: classroomToDeleteId,
        },
      });
      console.log(result);
      setClassrooms(
        classrooms.filter((classroom) => {
          return classroom._id !== result.data.classroomId;
        })
      );
    } catch (err) {
      console.log(err);
    }
    setClassroomToDeleteId("");
    setDeleting(false);
  };
  return (
    <>
      <Header isTeacher={true} />

      <Box className={classes.NewClassroomBox}>
        <Button
          onClick={() => setModalIsOpen({ ...modalIsOpen, newClassroom: true })}
          variant="outline"
        >
          Create New Classroom
        </Button>
      </Box>
      {Object.keys(classrooms).length !== 0 ? (
        <Box className={classes.ClassroomsBox}>
          {classrooms.map((classroom) => {
            return (
              <ClassroomPreview
                key={classroom._id}
                classroomId={classroom._id}
                name={classroom.name}
                students={classroom.students}
                code={classroom.code}
                activeClassroomId={activeClassroom._id}
                openCodeModal={(event) =>
                  openCodeModalHandler(event, classroom.code, classroom.name)
                }
                openClassroomHandler={() => openClassroomHandler(classroom)}
                deleteCheckHandler={(event) =>
                  deleteCheckHandler(event, classroom._id)
                }
              />
            );
          })}
        </Box>
      ) : null}
      <Box className={classes.SpinnerBox}>{deleting ? <Spinner /> : null}</Box>

      {activeClassroom.name ? (
        <Classroom
          classroomName={activeClassroom.name}
          classroomCode={activeClassroom.code}
          classroomId={activeClassroom._id}
        />
      ) : (
        <Box className={classes.PromptBox}>
          <Heading as="h2" className={classes.Prompt}>
            Select a classroom!
          </Heading>
        </Box>
      )}
      {classroomToDeleteId !== "" ? (
        <Modal
          closeModalHandler={() => setClassroomToDeleteId("")}
          size="small"
        >
          <Heading as="h1" size="lg">
            Are you sure you want to delete the classroom {}?
          </Heading>

          <Box display="flex" justifyContent="space-evenly">
            <Button variant="ghost" onClick={() => setClassroomToDeleteId("")}>
              Cancel
            </Button>
            <Button
              variant="outline"
              variantColor="teal"
              onClick={() => deleteClassroomHandler()}
            >
              Delete
            </Button>
          </Box>
        </Modal>
      ) : null}
      {modalIsOpen.newClassroom ? (
        <Modal
          closeModalHandler={() =>
            setModalIsOpen({ ...modalIsOpen, newClassroom: false })
          }
          size="small"
        >
          <Heading as="h1" size="lg">
            Create New Classroom
          </Heading>
          <Input
            name="name"
            placeholder="Classroom Name"
            onChange={inputHandler}
            margin="20px 0"
            minHeight="40px"
          />
          <Box display="flex" justifyContent="space-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                setModalIsOpen({ ...modalIsOpen, newClassroom: false })
              }
            >
              Cancel
            </Button>

            <Button
              variant="outline"
              variantColor="teal"
              onClick={createClassroomHandler}
            >
              Create
            </Button>
          </Box>
        </Modal>
      ) : null}
      {codeToDisplay.code !== "" ? (
        <Modal
          closeModalHandler={() => setCodeToDisplay({ code: "", name: "" })}
          size="small"
        >
          <Box className={classes.CodeBox}>
            <Heading as="h1" size="md">
              Classroom Code for {codeToDisplay.name}:
            </Heading>
            <h2 className={classes.Code}>{codeToDisplay.code}</h2>
            <Button
              variant="solid"
              onClick={() => setCodeToDisplay({ code: "", name: "" })}
            >
              Close
            </Button>
          </Box>
        </Modal>
      ) : null}
    </>
  );
};

export default Classrooms;
