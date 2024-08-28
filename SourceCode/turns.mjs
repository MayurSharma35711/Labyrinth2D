/*
--------------------------------------------------
IDEAS

- The maximum amount of blocks you can move per turn is your speed stat
    - Same for monsters

- Per turn the actions move in this order

    - Move and interact or interact and move(or if speed is high enough then move, interact, move ...)
    - Then effect from the biome you are at

    - Attack
        - Either use the special from the weapon or the armor which costs a certain amt of energy(see the log for info about energy)
        - or do a regular attack

    - Gain energy
    - Then monsters do the same

- Special information

    - Per turn all of your players can move, attack and interact

    - If you move and you get outside of the captains scope that player's turn gets skipped
        - If another player goes to save them in the same turn then that player's turn can be continued
    
    - You cannot change any pieces of equipment you have on after you attack that must be done in the interaction step

--------------------------------------------------
*/