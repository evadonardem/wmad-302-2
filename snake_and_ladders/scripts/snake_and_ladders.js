class Die {

    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six', 
    };

    /**
     * Complete the Die class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, sides, which represents the number of sides on the die (by default 6).
     * 2. The class should have a method named roll that returns a random integer between 1 and the number of sides (inclusive).
     * 3. The class should hava a method getting icon that returns a string representing a die icon using font-awesome.
     *    - For example, if the die has 6 sides, the method should return '<i class="fa fa-dice-six"></i>'.
     *    - If the die has 4 sides, it should return '<i class="fa fa-dice-four"></i>', and so on.
     * 
     * Example usage:
     * const die = new Die(6);
     */
}