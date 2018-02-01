"""
Planner for Yahtzee
Simplifications:  only allow discard and roll, only score against upper level
"""

# Used to increase the timeout, if necessary
import codeskulptor
codeskulptor.set_timeout(120)

def gen_all_sequences(outcomes, length):
    """
    Iterative function that enumerates the set of all sequences of
    outcomes of given length.
    """
    
    answer_set = set([()])
    for dummy_idx in range(length):
        temp_set = set()
        for partial_sequence in answer_set:
            for item in outcomes:
                new_sequence = list(partial_sequence)
                new_sequence.append(item)
                temp_set.add(tuple(new_sequence))
        answer_set = temp_set
    return answer_set

def gen_all_sequences2(outcomes, length):
    """
    Iterative function that enumerates the set of all sequences of
    outcomes of given length.
    """
    answer_set = set([()])
    for dummy_idx in range(length):
        temp_set = set()
        for partial_sequence in answer_set:
            
            
            for item in outcomes:
                #print item
                new_sequence = list(partial_sequence)
                #print new_sequence.count(item) ,'new_sequence'
                #print outcomes.count(item) ,'outcomes'
                if new_sequence.count(item) != outcomes.count(item):
                    new_sequence.append(item)
                    temp_set.add(tuple(sorted(new_sequence)))
        answer_set = temp_set
    return list(answer_set)

def score(hand):
    """
    Compute the maximal score for a Yahtzee hand according to the
    upper section of the Yahtzee score card.

    hand: full yahtzee hand

    Returns an integer score 
    """
    counts = dict()
    val = 0
    for item in hand:
        if(counts.has_key(item)):
            counts[item] = counts.get(item) + item
        else:
            counts[item] = item
    for item in counts:
        if( val < counts.get(item)):
            val = counts.get(item)
    return val



def expected_value(held_dice, num_die_sides, num_free_dice):
    """
    Compute the expected value based on held_dice given that there
    are num_free_dice to be rolled, each with num_die_sides.

    held_dice: dice that you will hold
    num_die_sides: number of sides on each die
    num_free_dice: number of dice to be rolled

    Returns a floating point expected value
    """
    hand2 = []
    var = 0
    for ids in range(num_die_sides):
        hand2.append(ids+1)
    seq_outcomes = gen_all_sequences(tuple(hand2),num_free_dice)
    for idx in seq_outcomes:
        var += score(held_dice + idx)
    print seq_outcomes
    print var,len(seq_outcomes),float(var)/float((len(seq_outcomes)))
    return float(var)/float((len(seq_outcomes)))


def gen_all_holds(hand):
    """
    Generate all possible choices of dice from hand to hold.

    hand: full yahtzee hand

    Returns a set of tuples, where each tuple is dice to hold
    """
    temp = []
    total = [()]

    for idx in range(len(hand)):
        temp.append(gen_all_sequences2(hand,idx+1))
    for idx in temp:
        total += idx
    return set(total)



def strategy(hand, num_die_sides):
    """
    Compute the hold that maximizes the expected value when the
    discarded dice are rolled.

    hand: full yahtzee hand
    num_die_sides: number of sides on each die
    
    Returns a tuple where the first element is the expected score and
    the second element is a tuple of the dice to hold
    """
    holds = gen_all_holds(hand)
    value = 0
    tuple_to_ret = 0
    for hold in holds:
        free_len = len(hand) - len(hold)
        #print len(hold),free_len,'hold'
        exp_v = expected_value(hold, num_die_sides, free_len)
        if(value < exp_v):
            value = exp_v
            tuple_to_ret = hold
    return (value, tuple_to_ret)

def run_example():
    """
    Compute the dice to hold and expected score for an example hand
    """
    num_die_sides = 6
    hand = (1, 1, 1, 5, 6)
    hand_score, hold = strategy(hand, num_die_sides)
    print "Best strategy for hand", hand, "is to hold", hold, "with expected score", hand_score
    
    
#run_example()
#import poc_holds_testsuite
#poc_holds_testsuite.run_suite(gen_all_holds)
                                       
#print gen_all_holds((1,))
#print score((6, 6, 1, 6))
#print strategy((1,), 6) 
#expected (3.5, ()) but received (8.7538580246913575, ())
 