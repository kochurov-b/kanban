import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { BoardsState } from "../../store/types/boards";
import { addBoard } from "../../store/actions/boards";
import { toggleModal } from "../../store/actions/modal";
import BoardLink from "../BoardLink";
import AddModal from "../Modal/Add";
import { EAddNewComponent, ButtonAdd } from "../Buttons";

import * as Main from "./styles";

export default () => {
  const boards = useSelector<AppState, BoardsState>(state => state.boards);
  const isModalOpen = useSelector<AppState, Boolean>(
    state => state.modal.isModalOpen
  );

  const dispatch = useDispatch();

  const addBoardHandle = ({ name }: { name: string }) => {
    dispatch(addBoard(new Date().getTime(), name));
    dispatch(toggleModal());
  };

  return (
    <Main.Main>
      <Main.Container>
        <Main.Title>Kanban Board</Main.Title>
        <Main.Content>
          <Main.BoardList>
            {Object.keys(boards).map(board => (
              <BoardLink key={boards[board].id} board={boards[board]} />
            ))}
            <ButtonAdd
              actionName={EAddNewComponent.Board}
              onClick={() => dispatch(toggleModal())}
            >
              Create new board
            </ButtonAdd>
            {isModalOpen && (
              <AddModal
                name={EAddNewComponent.Board}
                action={addBoardHandle}
                closeModal={() => dispatch(toggleModal())}
              />
            )}
          </Main.BoardList>
        </Main.Content>
      </Main.Container>
    </Main.Main>
  );
};
