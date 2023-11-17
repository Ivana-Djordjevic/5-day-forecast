# 5-day-forecast

## Description

The goal is the following:

**
User Story
- AS A traveler
- I WANT to see the weather outlook for multiple cities
- SO THAT I can plan a trip accordingly

Acceptance Criteria
- GIVEN a weather dashboard with form inputs
- WHEN I search for a city
- THEN I am presented with current and future conditions for that city and that city is added to the search history
- WHEN I view current weather conditions for that city
- THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
- WHEN I view future weather conditions for that city
- THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind -speed, and the humidity
- WHEN I click on a city in the search history
- THEN I am again presented with current and future conditions for that city
**

While I have met the requirements for this project, I believe there is still room for improvements in various areas ie:

- <u>code optimization:</u> currently, there are no conditionals in place for cities and countries that have identical names, which has the potential for ambiguity. To address this issue, a function should be implemented to provide users with a list of potential city options that includes additional information such as state, zipcode, and country enabling them to select the correct city with clarity.

- <u>code optimization:</u> establish a geographic limitation on the app. I would need to inquire more info about the openweathermap API (OWM) and its limitations. For instance, the API provides the city name 'Serbia' when 'Belgrade' is entered, thus attributing the weather for a single city to an entire country. 

- <u>code optimization:</u> the current implementation of local storage functions deviates from the standard conventions. It is advisable to abstract these functions in order to separate their logic from the business program flow of the code. This will aid in maintaining the code simple and organized.

- <u>code consistency:</u> The way the weather data was extracted from the API is the easiest and most direct way, however it is not in alignment with how the forecast data was extracted. Think about it this way, on its own, the weather array (as seen in console) can be confusing, as it may seem like a list of randomly assigned numbers. In contrast, the forecast array is clearer, as the property names indicate what values each number represents.

- <u>code consistency:</u> There is discrepancy between the weather and forecast dates format, as they come from different sources. The weather date comes from the dayjs API (DJ) where the format can be customized, while the forecast dates comes from OWM where it cannot be customized. An easy fix would be to adjust the weather date format to match the forecast one, but it may be more beneficial to customize the date format to include the day of the week. This would make it easier to locate oneself in the space of time. In order to achieve this optimization, we can substitute the OWM dates with the customized date format provided by DJ.

- <u>user experience:</u> to enhance the usability of the application for a global audience, it may be beneficial to incorporate the option of viewing weather data in imperial units. While the metric system is widely used, the imperial system is commonly employed in the USA. Thus, including a feature that facilitates the conversion between the two units can improve the accessibility of the application.

- <u>user experience:</u> to enhance the user experience of the application, it may be advisable to incorporate a feature that allows users to easily erase their search history. Although this can be accomplished through coding in the console, individuals who lack coding knowledge may encounter difficulty. As such, the addition of a button that can conveniently perform this task can improve the accessibility and user-friendliness of the application.

- <u>bugs:</u> address the issue where the application is displaying more than the 5 most recent search entries upon refreshing the page. This behavior is unintended and requires fixing.

- <u>bugs:</u> Resolve the problem of a random dot appearing next to the sidebar upon launching the application or refreshing the page. This behavior is unintended and requires fixing.

As a point of reference, the images below demonstrate the application's interface. 
</br>Main:
![main](https://github.com/runningaroundintheabyss/5-day-forecast/assets/127266659/d54df6ec-311e-4e0a-b0fb-4cc5ad49afc6)
City searched:
![citySearched](https://github.com/runningaroundintheabyss/5-day-forecast/assets/127266659/72fe0ca2-bed1-419a-9333-10c03f4fb61a)
History:
![historyDisplayed](https://github.com/runningaroundintheabyss/5-day-forecast/assets/127266659/58156e22-1b17-4c9b-a29f-fb709772eb30)

Here is the link: https://ivana-djordjevic.github.io/5-day-forecast/


## Instalations

N/A

## Usage

Access the latest weather information and a five-day forecast for a given city.

## Credits

- weather API: https://openweathermap.org/
- date API: https://day.js.org/

 ** from their README file 

-  https://ucdavis.bootcampcontent.com/ucdavis-boot-camp/UCD-VIRT-FSF-PT-03-2023-U-LOLC/-/blob/main/06-Server-Side-APIs/02-Challenge/README.md

- background image: https://www.rawpixel.com/image/5805989 , has a commercial use license

## License

MIT License

