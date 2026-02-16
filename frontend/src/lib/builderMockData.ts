import type { BouquetComponent, ColorPalette } from '@/types/builder';

export const mockFlowers: BouquetComponent[] = [
    { id: 101, name: 'Роза красная', component_type: 'flower', price: '150', image: '', color: '#DC143C' },
    { id: 102, name: 'Роза белая', component_type: 'flower', price: '150', image: '', color: '#FFFAF0' },
    { id: 103, name: 'Роза розовая', component_type: 'flower', price: '160', image: '', color: '#FFB6C1' },
    { id: 104, name: 'Пион', component_type: 'flower', price: '280', image: '', color: '#FFB7C5' },
    { id: 105, name: 'Тюльпан', component_type: 'flower', price: '120', image: '', color: '#FF6347' },
    { id: 106, name: 'Хризантема', component_type: 'flower', price: '90', image: '', color: '#FFD700' },
    { id: 107, name: 'Гортензия', component_type: 'flower', price: '350', image: '', color: '#9370DB' },
    { id: 108, name: 'Ранункулюс', component_type: 'flower', price: '220', image: '', color: '#FFA07A' },
];

export const mockGreenery: BouquetComponent[] = [
    { id: 201, name: 'Эвкалипт', component_type: 'greenery', price: '80', image: '', color: '#8FBC8F' },
    { id: 202, name: 'Рускус', component_type: 'greenery', price: '60', image: '', color: '#228B22' },
    { id: 203, name: 'Писташ', component_type: 'greenery', price: '70', image: '', color: '#90EE90' },
    { id: 204, name: 'Салал', component_type: 'greenery', price: '50', image: '', color: '#2E8B57' },
    { id: 205, name: 'Аспидистра', component_type: 'greenery', price: '90', image: '', color: '#006400' },
];

export const mockWraps: BouquetComponent[] = [
    { id: 301, name: 'Крафт', component_type: 'wrap', price: '100', image: '', color: '#DEB887' },
    { id: 302, name: 'Матовая плёнка', component_type: 'wrap', price: '150', image: '', color: '#F5F5DC' },
    { id: 303, name: 'Фетр', component_type: 'wrap', price: '180', image: '', color: '#D4A5A5' },
    { id: 304, name: 'Сетка', component_type: 'wrap', price: '120', image: '', color: '#F0E68C' },
];

export const mockRibbons: BouquetComponent[] = [
    { id: 401, name: 'Атласная лента', component_type: 'ribbon', price: '50', image: '', color: '#D4A5A5' },
    { id: 402, name: 'Бархатная лента', component_type: 'ribbon', price: '80', image: '', color: '#8B0000' },
    { id: 403, name: 'Джутовый шпагат', component_type: 'ribbon', price: '30', image: '', color: '#C4A882' },
    { id: 404, name: 'Органза', component_type: 'ribbon', price: '60', image: '', color: '#FFF0F5' },
];

export const mockColorPalettes: ColorPalette[] = [
    { id: 'pastel', name: 'Пастельная нежность', colors: ['#FFD1DC', '#FFDAB9', '#E6E6FA', '#F0FFF0', '#FFF0F5'] },
    { id: 'bright', name: 'Яркие краски', colors: ['#FF4500', '#FFD700', '#FF69B4', '#FF6347', '#DC143C'] },
    { id: 'white', name: 'Белая классика', colors: ['#FFFFFF', '#FFFAF0', '#FFF5EE', '#F5F5DC', '#FAFAD2'] },
    { id: 'red', name: 'Страстный красный', colors: ['#DC143C', '#8B0000', '#B22222', '#FF6347', '#CD5C5C'] },
    { id: 'purple', name: 'Лавандовый вечер', colors: ['#9370DB', '#8A2BE2', '#DDA0DD', '#E6E6FA', '#D8BFD8'] },
    { id: 'sunset', name: 'Осенний закат', colors: ['#FF8C00', '#FF6347', '#FFD700', '#DAA520', '#CD853F'] },
    { id: 'monochrome', name: 'Элегантный моно', colors: ['#2F4F4F', '#696969', '#A9A9A9', '#D3D3D3', '#F5F5F5'] },
    { id: 'tropical', name: 'Тропический', colors: ['#FF1493', '#FF6347', '#FFD700', '#00CED1', '#32CD32'] },
];

export const mockPapers: BouquetComponent[] = [
    { id: 501, name: 'Тишью белая', component_type: 'paper', price: '40', image: '', color: '#FFFFFF' },
    { id: 502, name: 'Тишью розовая', component_type: 'paper', price: '40', image: '', color: '#FFD1DC' },
    { id: 503, name: 'Калька', component_type: 'paper', price: '60', image: '', color: '#F5F5F5' },
    { id: 504, name: 'Гофра кремовая', component_type: 'paper', price: '50', image: '', color: '#FFDEAD' },
    { id: 505, name: 'Гофра лавандовая', component_type: 'paper', price: '50', image: '', color: '#E6E6FA' },
    { id: 506, name: 'Крафт-бумага', component_type: 'paper', price: '35', image: '', color: '#DEB887' },
];

export const componentEmoji: Record<string, string> = {
    'Роза красная': '🌹',
    'Роза белая': '🤍',
    'Роза розовая': '🌸',
    'Пион': '🌺',
    'Тюльпан': '🌷',
    'Хризантема': '🏵️',
    'Гортензия': '💜',
    'Ранункулюс': '🧡',
    'Эвкалипт': '🌿',
    'Рускус': '🍃',
    'Писташ': '☘️',
    'Салал': '🍀',
    'Аспидистра': '🌱',
    'Крафт': '📦',
    'Матовая плёнка': '✨',
    'Фетр': '🎀',
    'Сетка': '🕸️',
    'Атласная лента': '🎗️',
    'Бархатная лента': '🎗️',
    'Джутовый шпагат': '🪢',
    'Органза': '🎀',
    'Тишью белая': '📄',
    'Тишью розовая': '💗',
    'Калька': '📃',
    'Гофра кремовая': '📜',
    'Гофра лавандовая': '💜',
    'Крафт-бумага': '📦',
};
