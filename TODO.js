backup database
frined list use name and not displayname

requirePrivate => .db .twitter .email

event as string in npc extra

TODO:

ability window, bullet amount flicker

s.newBoost used in both s.ability and s.permboost

id => key -.-
id would refer to the template

kill enemy => drop and quit map same time = bug

ability no longer in function form,
instead refers to Db.abilityAttack

Db.npc use add()

use ability template in Ability.creation

Db.query.ability no idea if works,

test preset,

different worker for zelda and rs

display combat lvl and map lvl

test if Db.js works, (no Db_private)

test $GET_, wont work in dialogue cuz $GET set too late

check if contribution username already taken

mongodb use forEach

invinciblity if close dont move after quest

gravestone more obvious, animated

create new ability for quest


JOB:
22 juin - 28 juin: 29.5h			(couper le mardi a 16h) + 1.5h entrainement
29 juin - 5 juillet: 32.5h:			 30.25 + 2 + .25
6-12: 29.5h			, couper lundi 15h
13-19: genre 20h
2--25: 25h			conger dimanche, mercredi start a 13h
27-2: lundi = 3h, 30.25 + 2 + .25 - 5.25 = 27.25


display name

well bat appear outside

script delete old account no tutorial

allow dongers for some ppl

need to save contribution.globalMessage
refer friend: small pt if complete tutorial, big pt every quest he completes

window name weird, open quest win then passive


==TODO NOW==

remove preset === false

finish ability list

sprite cave centerY

see quest cycle value in tab quest

==TODO AFTER NEW SDK==

set and get for party,
_team quest variable
prevent challenge in party

fix cycle week

fix passiveGrid cycle

urlimg.src = URL.createObjectURL(t.toBlob ? t.toBlob() : t.mozGetAsFile('file.png'));
http://jsperf.com/fastest-canvas-drawing/2
cross origin problem...



== long term ==

follower system,
each player has a page where can put anything
ppl can also follow that page
click and see page with 

make video advertizing dev

==PRESDK==
give reason for dev to develop
-follower
-rating
-powerful game engine:
	-give quest demos (mention open-source)
	-boss
	-easy access to make highscore + challenge
	-easy to make multiplayer quest
-try it yourself on rainingchain


follower:
-message when new quest


link with youtube, fb, twitter

give reason for players
-highscore, challenge
-customization
-page that displays choosen achievements


#####################
TOFIX


midnight crash
TypeError: Cannot read property 'grid' of undefined
    at Object.Passive.getBoost (C:\rc\rainingchain\server\client\js\shared\passiveGrid.js:215:54)
    at Object.Passive.updateBoost (C:\rc\rainingchain\server\client\js\shared\passiveGrid.js:276:40)
###################################


desactivate features like passiveGrid


#####################
TOADD:

SKIPPED: db.filter, passive

save rs items price

visibleIf linked with html.div CONTINUE





==REVAMP==

BISON doesnt send dialogue if too close from npc? it returns undefined

add more Skill.unlockableContent

schema and models for mongodb (makes it easier to update) http://i.gyazo.com/5072f4fb7674107a744ba828206cc5c0.png

===POST SDK===
stat window

boss documentation, req chal highscore
customMod,





join party member
get same quest variable than party member


POST RELEASE:
REVAMP ALL FUCKING HTML WINDOWS
waypoint window

enemy that boost = boost atkspd
enemy reflect
aquanite:		
aquagoblin:		
basilisk: 		
draco: 		
dragon:		
dragonBaby:		
goddessFire:	knockback, big regen
goddessIce:
scorpion: 
birdBlue:
snake:		
werewolf:
troll:


git add -A
git commit -m "unstable"
git push


