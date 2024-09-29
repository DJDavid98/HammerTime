<h1>HammerTime <a title="Crowdin" target="_blank" href="https://crowdin.com/project/hammertime"><img src="https://badges.crowdin.net/hammertime/localized.svg" alt=""></a></h1>

I discovered [DiscordTimeStamper] through [this Reddit post] and immediately knew this could be turned into a website,
so here it is.

[discordtimestamper]: https://github.com/TimeTravelPenguin/DiscordTimeStamper/
[this reddit post]: https://www.reddit.com/r/discordapp/comments/oiv86b/i_made_a_tool_to_make_timestamps_for_discord/

This project is not affiliated with Discord in any way shape or form.

Application logo based on [Hammer] by John Caserta, from The Noun Project licensed under [CC BY 3.0 Unported]

[hammer]: https://meta.m.wikimedia.org/wiki/File:Hammer_-_Noun_project_1306.svg
[cc by 3.0 unported]: https://creativecommons.org/licenses/by/3.0/deed.en

## Translation

New language contributions are welcome! They are handled through [Crowdin]. If you don't see your language listed,
[join our Discord server] and ask for your language to be added to the project in the [#translator-signup] channel. You
will be given the Translator role and granted access to a language-specific channel for further discussion. This is
necessary so that when new translations are needed for any potential new site features, I have an easy way to reach
everyone at once.

[crowdin]: https://crowdin.com/project/hammertime
[join our discord server]: https://hammertime.cyou/discord
[#translator-signup]: https://discord.com/channels/952258283882819595/952292965211074650

English and Hungarian translations have been included, so no translators will be needed for these two languages.

<details>
<summary>How to set up Credits generation locally</summary>

> [!NOTE]
> This section is primarily for me, the developer, to be able to refer back to these instructions in the future. However, if you would like to know the process on how to set this up locally, feel free to read on.

1. Obtain a Crowdin API token for your account at https://crowdin.com/settings#api-key
   - You can enter any name you like
   - Check the "Projects" scope and select "Read only" from the dropdown next to it
   - Select "Read and write" in the "Reports" line inside "Projects"
2. Make a copy of `.env.template` at the root of the repository called `.env`
   - This file is normally ignored in version control, if you are committing your changes, make sure it id not included.
3. Fill in the environment variables inside the `.env` file as follows:
   - `CROWDIN_API_KEY` should be set to the token you just created
   - `CROWDIN_PROJECT_IDENTIFIER` is the text-based identifier on the project, this is typically at the end of the project page URL, e.g. in https://crowdin.com/project/hammertime the value that should be entered here is `hammertime`. You must have manager access to the project in question for the script to find it.
   - You can leave the rest of the values as-is.
4. Now you can run `npm run dev` without the warning message related to credit generation
</details>

### Credits

- 🇸🇦 Arabic: [Raphael Santiago](https://crowdin.com/profile/raphael.santiago.53)
- 🇧🇬 Bulgarian
  - [Alexander](https://crowdin.com/profile/Mr.Shad)
  - [Rxshi](https://crowdin.com/profile/Rxshi)
- Catalan: [sware](https://crowdin.com/profile/sware)
- 🇨🇳 Chinese Simplified
  - [CPYW_7226](https://crowdin.com/profile/CPYW_7226)
  - [User670](https://crowdin.com/profile/User670)
  - [姓甚名谁](https://crowdin.com/profile/febilly)
- 🇹🇼 Chinese Traditional
  - [CPYW_7226](https://crowdin.com/profile/CPYW_7226)
  - [investigator VT](https://crowdin.com/profile/ms.investigator)
  - [notlin4](https://crowdin.com/profile/notlin4)
- 🇭🇷 Croatian: [Volvone](https://github.com/volvone)
- 🇨🇿 Czech
  - [Blurplix](https://crowdin.com/profile/Blurplix)
  - [klauny](https://crowdin.com/profile/klauny)
  - [イーテルニティ ☄️](https://crowdin.com/profile/Ethxrnity)
- 🇩🇰 Danish
  - [jovictasor](https://crowdin.com/profile/jovictasor)
  - [Lennart Christiansen](https://crowdin.com/profile/LennartDenmark)
- 🇳🇱 Dutch: [Jesse](https://github.com/Jessuhh)
- 🇫🇷 French
  - [Alexander](https://crowdin.com/profile/Mr.Shad)
  - [Cookie Kiro](https://crowdin.com/profile/Cookikui)
  - [HumainAbsurde](https://crowdin.com/profile/humain)
  - [M4gicalCat](https://crowdin.com/profile/M4gicalCat)
  - [Ouiouibaguette](https://crowdin.com/profile/Ouiouibaguette)
  - [sivelswhy](https://crowdin.com/profile/sivelswhy)
  - [ValouFCH](https://crowdin.com/profile/ValouFCH)
- 🇩🇪 German
  - [Carlos Diener](https://crowdin.com/profile/carlos.diener)
  - [Fabian9799](https://crowdin.com/profile/Fabian9799)
  - [Julius Geiger](https://crowdin.com/profile/julix00)
- 🇬🇷 Greek: [Belle Bernice](https://crowdin.com/profile/BelleBernice)
- 🇮🇱 Hebrew: [Amit Cohen](https://crowdin.com/profile/ZeRealOne)
- 🇮🇳 Hindi: [Balajiasli](https://crowdin.com/profile/Balajiasli)
- 🇮🇩 Indonesian: [Jackie](https://github.com/Jckcr)
- 🇮🇹 Italian: [Lory Pelli](https://github.com/lorypelli)
- 🇯🇵 Japanese
  - [eai04191](https://crowdin.com/profile/eai04191)
  - [sakana](https://crowdin.com/profile/sakana0580)
  - [TheOnlyRAK](https://crowdin.com/profile/TheOnlyRAK)
  - [のむチュウ (sjk)](https://github.com/sjkim04)
- 🇰🇷 Korean
  - [Bin](https://crowdin.com/profile/cheesepickle12345678)
  - [김카츄 (sjk)](https://github.com/sjkim04)
- 🇱🇻 Latvian: [Casper](https://crowdin.com/profile/JajarGG)
- 🇱🇹 Lithuanian
  - [Seenoc](https://crowdin.com/profile/Seenoc)
  - [tayloryte](https://crowdin.com/profile/tayloryte)
- 🇲🇾 Malay: [Nurul Azeera Hidayah Muhammad Nur Hidayat Yasuyoshi (MNH48)](https://crowdin.com/profile/mnh48)
- 🇳🇴 Norwegian: [Ivy Wilson](https://crowdin.com/profile/zach.lawnmower)
- 🇮🇷 Persian: [Mohammad Safa Gray](https://crowdin.com/profile/DeadMarco)
- 🇵🇱 Polish
  - [meeekos](https://crowdin.com/profile/meeekos)
  - [MinerPL](https://github.com/minerpl)
  - [stha](https://crowdin.com/profile/sthakrk)
- 🇵🇹 Portuguese
  - [ً](https://crowdin.com/profile/buckshot-)
  - [Casper](https://crowdin.com/profile/JajarGG)
  - [Tiago](https://crowdin.com/profile/DemiCool)
- 🇧🇷 Portuguese, Brazilian
  - [Chris](https://crowdin.com/profile/Chrisdbhr)
  - [leo0six](https://crowdin.com/profile/leo0six)
  - [ShadowG](https://crowdin.com/profile/ShadowG)
- 🇷🇴 Romanian: [mihai](https://crowdin.com/profile/mihaiofficialRO)
- 🇷🇺 Russian
  - [Alexander](https://crowdin.com/profile/Mr.Shad)
  - [GameHacker](https://crowdin.com/profile/GameHacker)
  - [JudDayLum Official](https://crowdin.com/profile/JudDayLum)
  - [JudeDM](https://crowdin.com/profile/JudeDM)
  - [Luna](https://crowdin.com/profile/NightyCloud)
  - [Nikita Sharikov](https://crowdin.com/profile/Aligatoor)
  - [Vladimir](https://crowdin.com/profile/bill876)
  - [Крутой Бо](https://crowdin.com/profile/arturfomenko8)
  - [Рейт](https://crowdin.com/profile/helppriklreyta)
- 🇷🇸 Serbian (Latin): [net-tech-#7475](https://nettech.dev/)
- 🇪🇸 Spanish
  - [DrakeZero](https://crowdin.com/profile/DrakeZero)
  - [Yareaj](https://github.com/Yareaj/)
- 🇸🇪 Swedish
  - [joll05](https://crowdin.com/profile/joll05)
  - [Liggliluff](https://github.com/Liggliluff)
  - [Patrick Tobias](https://crowdin.com/profile/patricktobias)
  - [tunket](https://crowdin.com/profile/tunket)
- 🇹🇭 Thai: [timelessnesses](https://github.com/timelessnesses)
- 🇹🇷 Turkish: [tututuana](https://github.com/tututuana)
- 🇺🇦 Ukrainian
  - [Alexander](https://crowdin.com/profile/Mr.Shad)
  - [GameHacker](https://crowdin.com/profile/GameHacker)
  - [i](https://crowdin.com/profile/enky)
  - [Mykhailo Yaremenko](https://crowdin.com/profile/WhiteBear60)
- 🇵🇰 Urdu (Pakistan)
  - [Muhammad Dawood](https://crowdin.com/profile/Developer_X)
  - [muharslan](https://crowdin.com/profile/muharslan)
- 🇻🇳 Vietnamese: [Quan](https://crowdin.com/profile/quanonthecob)
