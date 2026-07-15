/**
 * =====================================================================
 *  IVR Calling Report Automation for Google Sheets + Apps Script
 * =====================================================================
 *  Created by   : Vijaya Kumar L
 *  Nickname     : risewithvj
 *  GitHub       : https://github.com/risewithvj
 *  LinkedIn     : https://www.linkedin.com/in/vijayakumarl/
 *  Email        : risewithvj@gmail.com
 * -----------------------------------------------------------------------
 *  Generic placeholder logo, base64-encoded, so the email template is
 *  self-contained out of the box. REPLACE this with your own company
 *  logo's base64 string -- see README.md "Customizing the logo" section.
 * =====================================================================
 */
const LOGO_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAEw0lEQVR4nO3dMW7bSBTHYWqRKtg6hwiwx8nmjN4cJ4AP4Xrh1tukEtaRJQ4583/v+2qRfLTmhwFdiNsGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBvXWYPkObL97e3W595ebr4u3IKC+2GjwR7i6A5ioX1jhHhXhMyo1lQV44I95qQGcVC+uWMcK8Jmb3+mD3ACmbEO/O61NE+4NkRzb4+2VoHvEo8q8xBnrYBrxbNavOQoWXAq8ay6lysq13Aq0ey+nyspVXAKXGkzMl8rQKGatoEnLarpc3LHG0ChopaBJy6m6XOzXlaBAxVlQ84fRdLn59jlQ8YKhMwBBMwBCsdcJXnxyr3wXilA4bqBAzBBAzBBAzBBAzBBAzBBAzBBAzBSgdc5c0HVe6D8UoHDNUJGIIJGIKVDzj9+TF9fo5VPmCorEXAqbtY6tycp0XAUFWbgNN2s7R5maNNwFBRq4BTdrWUOZmvVcBQjYAhmIAhmIAh2KfZA8CRPn/9dvdvar8+/4j5J6IdmLIeiXfPcTMImJL2RpgSsYApZ1R8CRELmFJGR7d6xAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYAKGYJ9mD0APX76/vd17zMvT5XLELJXYgTncI/HuOa4TAXOovRGK+PcEzGFGxSfi9wmYQ4yOTsT/T8AQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQTMAQzNsJm/n89dvdbzh4ff7hLYGLsgM38ki8e47jeAJuYm+EIl6TgBsYFZ+I1yPg4kZHJ+K1CBiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiCCRiC+WH3O/378++bn/nzr39OmAQEfNNHgr11jKA5ioDf8Ui4t84lZEYT8JWR4b53biEzioB/OTLc964lZPbyX+jt3HhXuC51tA94dkSzr0+21gGvEs8qc5CnbcCrRbPaPGRoGfCqsaw6F+tqF/Dqkaw+H2tpFXDKu21T5mS+VgFDNW0CTtvV0uZljjYBQ0UtAk7dzVLn5jwtAoaqygecvoulz8+xygcMlQkYggkYgpUOuMrzY5X7YLzSAUN1AoZgAoZgAoZgAoZgAoZgAoZgAoZgpQN+ff5xmT3DCFXug/FKBwzVCRiCCRiClQ84/fkxfX6OVT5gqKxFwKm7WOrcnKdFwFBVm4DTdrO0eZmjTcBQUauAU3a1lDmZr1XA27Z+HKvPx1raBbxt60ZyxFyjz/nR8708XYZe96Pnm3W/s7QMeNvW+2KOnGfUue89z6iI7z3PrPudoW3A27bOF3TGHHuv8ejxeyN+9PhZ93u21gFv2/wv6szrP3qtvTM+GuHe+Gfd75liBj3ajB9PT1oorMkCunJGyMJlFAvpHUeELFxGs6BuGBGycDmKhXWnjwQtWAAAAAAAAAAAAAAAAAAAAAAAAAAAAACo5T+cxkwYp1dKPgAAAABJRU5ErkJggg==";
