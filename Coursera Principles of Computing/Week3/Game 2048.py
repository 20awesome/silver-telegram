"""
Clone of 2048 game.
"""

import poc_2048_gui
import random

# Directions, DO NOT MODIFY
UP = 1
DOWN = 2
LEFT = 3
RIGHT = 4
# Offsets for computing tile indices in each direction.
# DO NOT MODIFY this dictionary.
OFFSETS = {UP: (1, 0),
           DOWN: (-1, 0),
           LEFT: (0, 1),
           RIGHT: (0, -1)}


def merge(line):
    """
    Helper function that merges a single row or column in 2048
    """
    # replace with your code from the previous mini-project
    new_list = [0] * len(line)
    returned_list = []
    index1 = 0  # Python's indexing starts at zero
    index2 = 0  # Python's indexing starts at zero
    for item in line:
        if (item != 0):
            new_list[index2] = line[index1]
            index2 += 1
        index1 += 1

    for index in range(len(new_list) - 1):
        if (new_list[index] == new_list[index + 1]):
            new_list[index] = new_list[index] + new_list[index + 1]
            new_list[index + 1] = 0

    for item in new_list:
        if (item != 0):
            returned_list.append(item)

    while len(returned_list) < len(line):
        returned_list.append(0)

    return returned_list


class TwentyFortyEight:
    """
    Class to run the game logic.
    """
    EXAMPLE_GRID = []

    def __init__(self, grid_height, grid_width):
        # replace with your code
        self._grid_height = grid_height
        self._grid_width = grid_width
        # reset the grid at the beginning of each game
        self.reset();

    def reset(self):
        """
        Reset the game so the grid is empty except for two
        initial tiles.
        """
        # replace with your code
        TwentyFortyEight.EXAMPLE_GRID = [[0 for dummy_col in range(self._grid_width)]
                                         for dummy_row in range(self._grid_height)]
        self.new_tile()
        self.new_tile()

    def __str__(self):
        """
        Return a string representation of the grid for debugging.
        """
        # replace with your code
        return str(TwentyFortyEight.EXAMPLE_GRID)

    def get_grid_height(self):
        """
        Get the height of the board.
        """
        # replace with your code
        return self._grid_height

    def get_grid_width(self):
        """
        Get the width of the board.
        """
        # replace with your code
        return self._grid_width

    def move(self, direction):
        """
        Move all tiles in the given direction and add
        a new tile if any tiles moved.
        """
        # replace with your code
        if (direction == RIGHT):
            for index, line in enumerate(TwentyFortyEight.EXAMPLE_GRID):
                new_line = merge(line)
                new_shifted_arr = []
                for item in new_line:
                    if (item == 0):
                        new_shifted_arr.append(item)
                for item in new_line:
                    if (item != 0):
                        new_shifted_arr.append(item)
                TwentyFortyEight.EXAMPLE_GRID[index] = new_shifted_arr
        elif (direction == LEFT):
            for index, line in enumerate(TwentyFortyEight.EXAMPLE_GRID):
                new_line = merge(line)
                TwentyFortyEight.EXAMPLE_GRID[index] = new_line
        elif (direction == UP):
            transponted_arr = [[TwentyFortyEight.EXAMPLE_GRID[j][i] for j in range(len(TwentyFortyEight.EXAMPLE_GRID))]
                               for i in range(len(TwentyFortyEight.EXAMPLE_GRID[0]))]
            for index, line in enumerate(transponted_arr):
                new_line = merge(line)
                transponted_arr[index] = new_line
            TwentyFortyEight.EXAMPLE_GRID = [[transponted_arr[j][i] for j in range(len(transponted_arr))] for i in
                                             range(len(transponted_arr[0]))]
        elif (direction == DOWN):
            transponted_arr = [[TwentyFortyEight.EXAMPLE_GRID[j][i] for j in range(len(TwentyFortyEight.EXAMPLE_GRID))]
                               for i in range(len(TwentyFortyEight.EXAMPLE_GRID[0]))]
            for index, line in enumerate(transponted_arr):
                new_line = merge(line)
                new_shifted_arr = []
                for item in new_line:
                    if (item == 0):
                        new_shifted_arr.append(item)
                for item in new_line:
                    if (item != 0):
                        new_shifted_arr.append(item)
                transponted_arr[index] = new_shifted_arr
            TwentyFortyEight.EXAMPLE_GRID = [[transponted_arr[j][i] for j in range(len(transponted_arr))] for i in
                                             range(len(transponted_arr[0]))]

        self.new_tile();

    def new_tile(self):
        """
        Create a new tile in a randomly selected empty
        square.  The tile should be 2 90% of the time and
        4 10% of the time.
        """
        # replace with your code

        numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4]
        random.choice(numbers)
        number = random.choice(numbers)

        column = random.randrange(0, self._grid_width)
        row = random.randrange(0, self._grid_height)
        if 0 in [num for elem in TwentyFortyEight.EXAMPLE_GRID for num in elem]:
            if (TwentyFortyEight.EXAMPLE_GRID[row][column] == 0):
                TwentyFortyEight.EXAMPLE_GRID[row][column] = number
            else:
                self.new_tile()
        else:
            pass

    def set_tile(self, row, col, value):
        """
        Set the tile at position row, col to have the given value.
        """
        # replace with your code
        TwentyFortyEight.EXAMPLE_GRID[row][col] = value

    def get_tile(self, row, col):
        """
        Return the value of the tile at position row, col.
        """
        # replace with your code
        return TwentyFortyEight.EXAMPLE_GRID[row][col]


poc_2048_gui.run_gui(TwentyFortyEight(5, 5))
