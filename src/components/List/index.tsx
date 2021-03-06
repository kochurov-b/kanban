import React, { useRef, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { AppState } from "../../store";
import { IList } from "../../store/types/lists";
import { removeList, editListName } from "../../store/actions/lists";
import { addTask, removeTasks } from "../../store/actions/tasks";
import { toggleModal } from "../../store/actions/modal";
import { getTasks } from "../../store/selectors/tasks";
import { TaskType, TaskArguments } from "../../store/types/tasks";
import { ContextList, ContextBoard } from "../../utils/context";
import AddModal from "../Modal/Add/index";
import Tooltip from "../Tooltip";
import TaskList from "./TaskList";
import More from "./More";
import { Item, Button } from "../Tooltip/styles";
import { EAddNewComponent } from "../Buttons";

import * as List from "./styles";

interface IProps {
  list: IList;
  index: number;
}

interface IInfoList {
  id: number;
  name: string;
}

export default (props: IProps) => {
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [infoList, setInfoList] = useState<IInfoList>({
    id: 0,
    name: props.list.name
  });

  const tasks = useSelector<AppState, TaskType[] | []>(state =>
    getTasks(state, props.list.id)
  );
  const isModalOpen = useSelector<AppState, Boolean>(
    state => state.modal.isModalOpen
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditName) {
      document.addEventListener("click", clickOutsideHandle);
    } else {
      document.removeEventListener("click", clickOutsideHandle);
      infoList.name !== props.list.name && sendEditedListName();
    }

    return () => {
      document.removeEventListener("click", clickOutsideHandle);
    };
  }, [isEditName]);

  const { list, index } = props;
  const listNameRef = useRef<HTMLTextAreaElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const boardId = useContext(ContextBoard);

  const editNameListHandle = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    listId: number
  ) => {
    setInfoList({
      id: listId,
      name: e.target.value
    });
  };

  const checkEnterNameHandle = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      setIsEditName(false);
      listNameRef.current && listNameRef.current.blur();
      e.preventDefault();
    } else {
      e.stopPropagation();
    }
  };

  const clickOutsideHandle = (e: MouseEvent) => {
    const node = listNameRef.current;
    node && !node.contains(e.target as Node) && setIsEditName(false);
  };

  const addTaskHandle = ({
    listId,
    name,
    description,
    category
  }: TaskArguments) => {
    const taskId: number = new Date().getTime();
    const taskArguments = {
      listId,
      id: taskId,
      name,
      description,
      category
    };
    dispatch(addTask(taskArguments));
    dispatch(toggleModal());
  };

  const visibleNameHandle = () => {
    !isEditName && setFocusToName();
    setIsEditName(prevState => !prevState);
  };

  const setFocusToName = () => {
    const node = listNameRef.current;
    node && node.focus();
    node && node.setSelectionRange(0, node.value.length);
  };

  const setStateListName = () => {
    setInfoList({
      ...infoList,
      name: props.list.name
    });
  };

  const sendEditedListName = () => {
    infoList.name !== ""
      ? dispatch(editListName(infoList.id, infoList.name))
      : setStateListName();
  };

  return (
    <ContextList.Provider
      value={{
        setIsTooltipOpen,
        tasks,
        listId: list.id
      }}
    >
      <Draggable draggableId={`${list.id}`} index={index}>
        {provided => (
          <List.Main
            id={`${list.id}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <List.Header>
              {!isEditName && (
                <List.Draggable
                  onClick={visibleNameHandle}
                  ref={draggableRef}
                  {...provided.dragHandleProps}
                />
              )}
              <List.Name
                maxRows={1}
                onChange={e => editNameListHandle(e, list.id)}
                onKeyDown={e => checkEnterNameHandle(e)}
                value={infoList.name}
                placeholder="Add list name"
                inputRef={listNameRef}
              />
              <More />
              {isTooltipOpen && (
                <Tooltip>
                  {list.name === "Done" && (
                    <Item>
                      <Button
                        onClick={() =>
                          dispatch(removeTasks(list.id, list.tasks))
                        }
                      >
                        Remove all tasks
                      </Button>
                    </Item>
                  )}
                  <Item>
                    <Button
                      onClick={() =>
                        dispatch(removeList(boardId, list.id, list.tasks))
                      }
                    >
                      Remove list
                    </Button>
                  </Item>
                </Tooltip>
              )}
            </List.Header>
            <Droppable key={list.id} droppableId={`${list.id}`} type="task">
              {(provided, snapshot) => (
                <List.Content
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <TaskList provided={provided} snapshot={snapshot} />
                </List.Content>
              )}
            </Droppable>
            {isModalOpen && (
              <AddModal
                name={EAddNewComponent.Task}
                action={addTaskHandle}
                closeModal={() => dispatch(toggleModal())}
              />
            )}
          </List.Main>
        )}
      </Draggable>
    </ContextList.Provider>
  );
};
