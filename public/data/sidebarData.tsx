export const sidebarData = [
  {
    id: 1,
    items: [
      {
        id: 1,
        name: "Dashboard",
        url: "/dashboard/",
        icon: <i className="las la-home"></i>,
      },
      {
        id: 2,
        name: "Cards",
        url: "/cards/",
        icon: <i className="las la-credit-card"></i>,
      },
      {
        id: 3,
        name: "Transactions",
        url: "/transactions/all-transactions/",
        icon: <i className="las la-exchange-alt"></i>,
        submenus: [
          { title: "All Transactions", url: "/transactions/all-transactions/" },
          { title: "Your Deposits", url: "/transactions/your-deposits/" },
          { title: "Card Transactions", url: "/transactions/card-transactions/" },
        ],
      },
      {
        id: 4,
        name: "Invoices",
        url: "/invoice/",
        icon: <i className="las la-file-invoice"></i>,
      },
      {
        id: 5,
        name: "Settings",
        icon: <i className="las la-cog"></i>,
        submenus: [
          { title: "Account", url: "/settings/account/" },
          { title: "Profile", url: "/settings/profile/" },
          { title: "Two-Factor Auth", url: "/settings/2fa/" },
        ],
      },
      {
        id: 6,
        name: "Support",
        icon: <i className="las la-headset"></i>,
        submenus: [
          { title: "Help Center", url: "/support/help-center/" },
          { title: "Contact Support", url: "/support/contact/" },
        ],
      },
    ],
  },
];
