import random

def rolldicefunction(face):
    return random.randint(1, face)

def main():
    face = 6
    roll = True
    while roll:
        choice_input = input("Ready to roll? Enter Q to Quit: ")
        if choice_input.lower() != "q":
            got_number = rolldicefunction(faces)
            print("You have rolled a", got_number)
        else:
            roll= False
