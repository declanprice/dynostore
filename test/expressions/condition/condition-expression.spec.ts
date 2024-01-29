import {convertToExpression} from "../../../src/expressions/condition/condition-expression";
import {eq} from "../../../src/expressions/condition/eq";
import {and} from "../../../src/expressions/condition/and";
import {or} from "../../../src/expressions/condition/or";
import {group} from "../../../src/expressions/condition/group";
import {not} from "../../../src/expressions/condition/not";
import {gte} from "../../../src/expressions/condition/gte";
import {gt} from "../../../src/expressions/condition/gt";
import {lt} from "../../../src/expressions/condition/lt";
import {lte} from "../../../src/expressions/condition/lte";
import {beginsWith} from "../../../src/expressions/condition/beginsWith";
import {exists} from "../../../src/expressions/condition/exists";
import {notExists} from "../../../src/expressions/condition/notExists";
import {between} from "../../../src/expressions/condition/between";
import {contains} from "../../../src/expressions/condition/contains";
import {anyOf} from "../../../src/expressions/condition/anyOf";
import {type} from "../../../src/expressions/condition/type";
import {size} from "../../../src/expressions/condition/size";
import {notEq} from "../../../src/expressions/condition/notEq";

describe('ConditionExpression', () => {

    it('eq() - should return expected expression', () => {
        const expression = convertToExpression(eq('name', 'declan'));
        expect(expression.expression).toEqual('#0 = :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            }
        })
    });

    it('notEq() - should return expected expression', () => {
        const expression = convertToExpression(notEq('name', 'declan'));
        expect(expression.expression).toEqual('#0 <> :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            }
        })
    });

    it('gt() - should return expected expression', () => {
        const expression = convertToExpression(gt('age', 25));
        expect(expression.expression).toEqual('#0 > :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                N: '25'
            }
        })
    });

    it('gte() - should return expected expression', () => {
        const expression = convertToExpression(gte('age', 25));
        expect(expression.expression).toEqual('#0 >= :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                N: '25'
            }
        })
    });

    it('lt() - should return expected expression', () => {
        const expression = convertToExpression(lt('age', 25));
        expect(expression.expression).toEqual('#0 < :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                N: '25'
            }
        })
    });

    it('lte() - should return expected expression', () => {
        const expression = convertToExpression(lte('age', 25));
        expect(expression.expression).toEqual('#0 <= :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                N: '25'
            }
        })
    });

    it('beginsWith() - should return expected expression', () => {
        const expression = convertToExpression(beginsWith('name', 'dec'));
        expect(expression.expression).toEqual('begins_with(#0, :1)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'dec'
            }
        })
    });

    it('between() - should return expected expression', () => {
        const expression = convertToExpression(between('year', '2018', '2020'));
        expect(expression.expression).toEqual('#0 between :1 and :2')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'year',
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: '2018'
            },
            ':2': {
                S: '2020'
            }
        })
    });

    it('exists() - should return expected expression', () => {
        const expression = convertToExpression(exists('name'));
        expect(expression.expression).toEqual('attribute_exists(#0)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name'
        })
        expect(expression.expressionAttributeValues).toEqual({
        })
    });

    it('notExists() - should return expected expression', () => {
        const expression = convertToExpression(notExists('name'));
        expect(expression.expression).toEqual('attribute_not_exists(#0)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name'
        })
        expect(expression.expressionAttributeValues).toEqual({
        })
    });

    it('contains() - should return expected expression', () => {
        const expression = convertToExpression(contains('year', '2018'));
        expect(expression.expression).toEqual('contains(#0, :1)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'year',
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: '2018'
            },
        })
    });

    it('anyOf() - should return expected expression', () => {
        const expression = convertToExpression(anyOf('year', ['2018', '2019', '2020']));
        expect(expression.expression).toEqual('#0 in (:1,:2,:3)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'year',
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: '2018'
            },
            ':2': {
                S: '2019'
            },
            ':3': {
                S: '2020'
            },
        })
    });


    it('type() - should return expected expression', () => {
        const expression = convertToExpression(type('year', 'S'));
        expect(expression.expression).toEqual('attribute_type(#0, :1)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'year',
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'S'
            },
        })
    });


    it('size() - should return expected expression', () => {
        const expression = convertToExpression(size('year'));
        expect(expression.expression).toEqual('size(#0)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'year',
        })
        expect(expression.expressionAttributeValues).toEqual({
        })
    });

    it('and() - should return expected expression', () => {
        const expression = convertToExpression(eq('name', 'declan'), and(), eq('age', 26));
        expect(expression.expression).toEqual('#0 = :1 and #2 = :3')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name',
            '#2': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            },
            ':3': {
                N: "26"
            }
        })
    });

    it('or() - should return expected expression', () => {
        const expression = convertToExpression(eq('name', 'declan'), or(), eq('age', 26));
        expect(expression.expression).toEqual('#0 = :1 or #2 = :3')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name',
            '#2': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            },
            ':3': {
                N: "26"
            }
        })
    });

    it('not() - should return expected expression', () => {
        const expression = convertToExpression(not(eq('name', 'declan')));
        expect(expression.expression).toEqual('not #0 = :1')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name',
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            },
        })
    });

    it('group() - should return expected expression', () => {
        const expression = convertToExpression(
            group(eq('name', 'declan'), or(), eq('age', 26))
        );
        expect(expression.expression).toEqual('(#0 = :1 or #2 = :3)')
        expect(expression.expressionAttributeNames).toEqual({
            '#0': 'name',
            '#2': 'age'
        })
        expect(expression.expressionAttributeValues).toEqual({
            ':1': {
                S: 'declan'
            },
            ':3': {
                N: "26"
            }
        })
    });
})