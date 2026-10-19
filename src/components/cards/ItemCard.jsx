import {ITEMS} from '../../engine/catalogue.js';
import {ChordCard} from './ChordCard.jsx';
import {ReharmCard,MixCard} from './ReharmCard.jsx';
import {QuizCard,CycleCard} from './CircleCards.jsx';
import {ScaleCard} from './ScaleCard.jsx';
import {PatternCard} from './PatternCard.jsx';
import {FeelCard} from './FeelCard.jsx';
import {ReadingCard} from './ReadingCard.jsx';

const CARDS={chord:ChordCard,reharm:ReharmCard,mix:MixCard,quiz:QuizCard,cycle:CycleCard,scale:ScaleCard,pattern:PatternCard,feel:FeelCard,sub:FeelCard,read:ReadingCard};
export function ItemCard(props){const Card=CARDS[ITEMS[props.it.id].type];return Card?<Card {...props}/>:null;}
