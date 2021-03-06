import { Reducer } from "redux";
import { boardConstants } from "../constants/boards";
import { BoardAction, BoardsState } from "../types/boards";
import { listConstants } from "../constants/lists";

export const boards: Reducer<BoardsState, BoardAction> = (
  state = {},
  action
) => {
  switch (action.type) {
    case boardConstants.ADD_BOARD: {
      const { boardId, boardName } = action.payload;
      return {
        ...state,
        [boardId]: {
          id: boardId,
          name: boardName,
          isOpen: false,
          lists: [],
          tasks: []
        }
      };
    }
    case boardConstants.ACTIVE_BOARD: {
      Object.keys(state).map(board => {
        state[board].id === action.payload
          ? (state[board].isOpen = true)
          : (state[board].isOpen = false);
      });
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload]
        }
      };
    }
    case listConstants.ADD_LIST: {
      const { boardId, listId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: [...state[boardId].lists, listId]
        }
      };
    }
    case listConstants.REMOVE_LIST: {
      const { boardId, listId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: state[boardId].lists.filter(list => list !== listId)
        }
      };
    }
    case listConstants.CHANGE_POSITION_LIST: {
      const { boardId, listId, sourceIndex, destinationIndex } = action.payload;
      const currentBoard = state[boardId];
      const newLists = [...currentBoard.lists];
      newLists.splice(sourceIndex, 1);
      newLists.splice(destinationIndex, 0, listId);

      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: newLists
        }
      };
    }
    default:
      return {
        ...state
      };
  }
};
