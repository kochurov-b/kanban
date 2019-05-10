import React, { PureComponent, createRef } from "react";
import { connect } from "react-redux";
import ListLayout from "./layout";
import { IList } from "../../../store/types/lists";
import { removeList, editListName } from "../../../store/actions/lists";
import {
  addTask,
  removeTask,
  addTaskMiddleware
} from "../../../store/actions/tasks";
import { AppState } from "../../../store";
import { getTasks } from "../../../store/selectors/tasks";
import { TaskType, TaskArguments } from "../../../store/types/tasks";

interface IProps {
  list: IList;
  boardId: number;
}

interface IStateToProps {
  tasks: TaskType[];
}

interface IDispatchProps {
  removeList: (boardId: number, listId: number, tasks: Array<number>) => void;
  editListName: (listId: number, nameList: string) => void;
  addTask: ({  }: TaskArguments) => void;
  removeTask: (listId: number, taskId: number) => void;
  addTaskMiddleware: (...actions: any) => void;
}

interface IState {
  taskName: string;
  isAddTaskInputOpen: boolean;
  isDraggable: boolean;
}

type Props = IProps & IStateToProps & IDispatchProps;

class List extends PureComponent<Props, IState> {
  public state = {
    taskName: "",
    isAddTaskInputOpen: false,
    isDraggable: false
  };

  private addItemInputRef = createRef<HTMLInputElement>();

  public editNameListHandle = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    listId: number
  ) => {
    this.props.editListName(listId, e.target.value);
  };

  private setTaskNameHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      taskName: e.target.value
    });
  };

  private _keyDownHandle = (
    e: React.KeyboardEvent<HTMLInputElement>,
    listId: number
  ) => {
    if (e.key === "Enter") {
      this.addTask(listId);
    }
  };

  public addTask = (listId: number) => {
    const taskId: number = new Date().getTime();

    const taskArguments = {
      listId,
      id: taskId,
      name: this.state.taskName,
      description: "hello"
    };

    if (this.state.taskName !== "") {
      this.props.addTask(taskArguments);
      this.createDocumentHandle();
      this.setState({
        taskName: "",
        isAddTaskInputOpen: false
      });
    }
  };

  private createDocumentHandle = () => {
    if (!this.state.isAddTaskInputOpen) {
      document.addEventListener("click", this._documentHandle);
    } else {
      document.removeEventListener("click", this._documentHandle);
    }
  };

  private _documentHandle = (e: MouseEvent) => {
    if (
      this.addItemInputRef.current &&
      !this.addItemInputRef.current.contains(e.target as HTMLElement)
    ) {
      this._addTaskHandle();
    }
  };

  private _addTaskHandle = () => {
    this.createDocumentHandle();
    this.setState(prevState => ({
      isAddTaskInputOpen: !prevState.isAddTaskInputOpen
    }));
  };

  public removeListHandle = (listId: number, tasks: Array<number>) => {
    const { boardId } = this.props;
    this.props.removeList(boardId, listId, tasks);
  };

  private _dropHandle = (e: React.DragEvent<HTMLElement>, listId: number) => {
    const data = e.dataTransfer.getData("transfer");
    const parseData = JSON.parse(data);

    if (parseData.listIdDraggable !== listId) {
      e.preventDefault();

      const taskArguments = {
        listId,
        id: parseData.task.id,
        name: parseData.task.name,
        description: "hello"
      };

      this.props.addTaskMiddleware(
        addTask(taskArguments),
        removeTask(parseData.listIdDraggable, parseData.task.id)
      );
    }

    this.setState({
      isDraggable: false
    });
  };

  private _dragOverHandle = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({
      isDraggable: true
    });
  };

  private _dragLeaveHandle = () => {
    this.setState({
      isDraggable: false
    });
  };

  public render(): JSX.Element {
    return (
      <ListLayout
        {...this.props}
        {...this.state}
        onRemoveList={this.removeListHandle}
        onSetTaskName={this.setTaskNameHandle}
        onEditNameList={this.editNameListHandle}
        onAddTask={this._addTaskHandle}
        onKeyDown={this._keyDownHandle}
        onDrop={this._dropHandle}
        onDragOver={this._dragOverHandle}
        onDragLeave={this._dragLeaveHandle}
        addItemInputRef={this.addItemInputRef}
      />
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: any): IStateToProps => ({
  tasks: getTasks(state, ownProps.list.id)
});

const mapDispatchToProps: IDispatchProps = {
  removeList,
  editListName,
  addTask,
  removeTask,
  addTaskMiddleware
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
