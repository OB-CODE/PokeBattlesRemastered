import { capitalizeString } from './helperfn';

describe('capitalizeString', () => {
  test('capitalizes first letter of a lowercase string', () => {
    expect(capitalizeString('pikachu')).toBe('Pikachu');
  });

  test('handles already capitalized string', () => {
    expect(capitalizeString('Pikachu')).toBe('Pikachu');
  });

  test('handles all uppercase string', () => {
    expect(capitalizeString('PIKACHU')).toBe('Pikachu');
  });

  test('handles single character string', () => {
    expect(capitalizeString('p')).toBe('P');
  });

  test('returns empty string for empty input', () => {
    expect(capitalizeString('')).toBe('');
  });

  test('handles string with spaces', () => {
    expect(capitalizeString('mr. mime')).toBe('Mr. mime');
  });

  test('handles string with numbers', () => {
    expect(capitalizeString('3pikachu')).toBe('3pikachu');
  });

  test('lowercases rest of string', () => {
    expect(capitalizeString('cHaRiZaRd')).toBe('Charizard');
  });

  test('handles single uppercase character', () => {
    expect(capitalizeString('A')).toBe('A');
  });
});
