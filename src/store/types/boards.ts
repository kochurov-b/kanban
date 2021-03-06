import { ADD_BOARD, ACTIVE_BOARD } from "../constants/boards";
import { AddListAction, RemoveListAction, ChangePositionList } from "./lists";

export type BoardsState = { [id: string]: BoardType };

export interface BoardType {
  id: number;
  name: string;
  isOpen: boolean;
  lists: Array<number>;
  tasks: Array<number>;
}

export interface AddBoardAction {
  type: ADD_BOARD;
  payload: {
    boardId: number;
    boardName: string;
  };
}

export interface ActiveBoardAction {
  type: ACTIVE_BOARD;
  payload: number;
}

export type BoardAction =
  | AddBoardAction
  | ActiveBoardAction
  | AddListAction
  | RemoveListAction
  | ChangePositionList;
