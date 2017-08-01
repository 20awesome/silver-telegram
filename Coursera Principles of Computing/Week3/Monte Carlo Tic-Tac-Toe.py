"""
Monte Carlo Tic-Tac-Toe Player
"""

import random
import poc_ttt_gui
import poc_ttt_provided as provided

# Constants for Monte Carlo simulator
# You may change the values of these constants as desired, but
#  do not change their names.
NTRIALS = 5  # Number of trials to run
SCORE_CURRENT = 1.0  # Score for squares played by the current player
SCORE_OTHER = 1.0  # Score for squares played by the other player
CURRENT_BOARD = []
BOARDS = []
MACHINE_PLAYER = 0
SCORES = []
DIM = 0


# Add your functions here.
def mc_trial(board, player):
    '''
    doc
    '''
    current_board = board
    if (len(SCORES) == 0):
        dim = board.get_dim()
        for row in range(dim):
            SCORES.append([])
            for dummy_column in range(dim):
                SCORES[row].append(0)

    empty_squares_for_length = current_board.get_empty_squares();
    for dummy_index in range(len(empty_squares_for_length)):
        empty_squares_for_choose = current_board.get_empty_squares();
        random_choice = random.choice(empty_squares_for_choose)
        if (player == provided.PLAYERX) and not (current_board.check_win()):
            current_board.move(random_choice[0], random_choice[1], player)
            player = provided.switch_player(player)
        elif (player == provided.PLAYERO) and not (current_board.check_win()):
            current_board.move(random_choice[0], random_choice[1], player)
            player = provided.switch_player(player)
        else:
            mc_update_scores(SCORES, current_board, player)


def mc_move(board, player, trials):
    '''
    doc
    '''
    global SCORES
    SCORES = []
    dim = board.get_dim()
    for row in range(dim):
        SCORES.append([])
        for dummy_column in range(dim):
            SCORES[row].append(0)
    for dummy_index in range(trials):
        current_board = board.clone()
        mc_trial(current_board, player)
    value = get_best_move(board, SCORES)
    return value


def mc_update_scores(scores, board, player):
    '''
    doc
    '''
    print board
    print scores, player, provided.PLAYERX, provided.PLAYERO, provided.EMPTY
    winner = board.check_win()
    dim = board.get_dim()
    for row in range(dim):
        for column in range(dim):
            if (winner == 4) or (board.square(row, column) == 4) or (board.square(row, column) == 1):
                pass
            elif ((player == winner) and (player == board.square(row, column))):
                # print i,j,'1tif'
                scores[row][column] = scores[row][column] + SCORE_CURRENT
            elif ((player == winner) and (player != board.square(row, column))):
                # print i,j,'2tif'
                scores[row][column] = scores[row][column] - SCORE_OTHER
            elif ((player != winner) and (player == board.square(row, column))):
                # print i,j,'3tif'
                scores[row][column] = scores[row][column] - SCORE_CURRENT
            elif ((player != winner) and (player != board.square(row, column))):
                # print i,j,'4tif'
                scores[row][column] = scores[row][column] + SCORE_OTHER


def get_best_move(board, scores):
    '''
    doc
    '''

    dict_of_scores = {}

    empty_squares_for_choose = board.get_empty_squares();
    if (max(max(scores)) == 0):
        random_choice = random.choice(empty_squares_for_choose)
        return random_choice
    else:
        for index in range(len(empty_squares_for_choose)):
            row = empty_squares_for_choose[index][0]
            column = empty_squares_for_choose[index][1]
            dict_of_scores[scores[row][column]] = [row, column]
    keys = dict_of_scores.keys()
    if (len(keys) > 0):
        max_key = max(keys)
        print board
        print max_key, 'max_key', tuple(dict_of_scores[max_key]), scores
        return tuple(dict_of_scores[max_key])

    else:
        max_key = random.choice(empty_squares_for_choose)
        return max_key


# Test game with the console or the GUI.  Uncomment whichever
# you prefer.  Both should be commented out when you submit
# for testing to save time.

provided.play_game(mc_move, NTRIALS, False)
# poc_ttt_gui.run_gui(3, provided.PLAYERX, mc_move, NTRIALS, False)

