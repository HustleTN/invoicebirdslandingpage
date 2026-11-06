import Link from "next/link";

import { siteConfig } from "@/config/site";

import type { LegalDocument } from "./legal-page";

const email = <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>;

export const privacyFr: LegalDocument = {
  title: "Politique de confidentialité",
  lead: "Comment InvoiceBirds collecte, utilise et protège les données personnelles, et quels sont vos choix et vos droits.",
  updated: "6 novembre 2026",
  summary: [
    "Nous ne vendons jamais vos données personnelles et ne les utilisons pas à des fins publicitaires.",
    "Nous utilisons vos données pour fournir, sécuriser et améliorer InvoiceBirds, et pour vous accompagner.",
    "Les données de vos clients que vous ajoutez à InvoiceBirds vous appartiennent. Nous les traitons uniquement sur vos instructions.",
    "Vos données sont chiffrées lors de leur transmission, et vous pouvez les télécharger ou les supprimer à tout moment.",
    `Pour toute question sur vos données, écrivez-nous à ${siteConfig.email}.`,
  ],
  intro: (
    <p>
      La présente politique de confidentialité explique comment InvoiceBirds (« <strong>InvoiceBirds</strong> », « <strong>nous</strong> »
      ou « <strong>notre</strong> ») traite les données personnelles lorsque vous consultez le site invoicebirds.com
      (le « <strong>Site</strong> »), créez un compte ou utilisez l’application InvoiceBirds et les services associés (ensemble avec le Site, les
      « <strong>Services</strong> »), vous inscrivez à notre newsletter ou nous contactez. Nous vous invitons à la lire avec nos{" "}
      <Link href="/fr/terms">Conditions d’utilisation</Link>.
    </p>
  ),
  sections: [
    {
      id: "who-we-are",
      title: "Qui sommes-nous ?",
      body: (
        <>
          <p>
            Au sens du Règlement général sur la protection des données de l’Union européenne (« <strong>RGPD</strong> »), du RGPD
            britannique et des autres lois applicables en matière de protection des données, InvoiceBirds est responsable du traitement des
            données personnelles décrites dans la présente politique, sauf dans les cas prévus à l’article 2.
          </p>
          <p>
            Vous pouvez nous contacter pour toute question relative à la protection de vos données, y compris pour exercer vos droits, à
            l’adresse {email}.
          </p>
        </>
      ),
    },
    {
      id: "our-role",
      title: "Notre rôle pour les données que vous gérez",
      body: (
        <>
          <p>
            Lorsque vous utilisez InvoiceBirds, vous pouvez ajouter des informations concernant vos propres clients et contacts, telles que
            leurs noms, adresses électroniques et postales, numéros d’identification fiscale, ainsi que le contenu de vos factures, devis,
            propositions commerciales et contrats (les « <strong>Données Client</strong> »).
          </p>
          <p>
            Pour les Données Client, vous êtes responsable du traitement et InvoiceBirds agit en qualité de sous-traitant. Nous traitons les
            Données Client uniquement pour vous fournir les Services, sur vos instructions documentées et conformément aux dispositions
            relatives à la protection des données figurant à l’article 13 de nos{" "}
            <Link href="/fr/terms#data-protection">Conditions d’utilisation</Link>.
          </p>
          <p>
            Si vous êtes le client de l’un de nos utilisateurs et souhaitez exercer vos droits sur les données qu’une entreprise détient à
            votre sujet dans InvoiceBirds, veuillez contacter directement cette entreprise. Si vous nous contactez, nous lui transmettrons
            votre demande.
          </p>
        </>
      ),
    },
    {
      id: "data-we-collect",
      title: "Données personnelles que nous collectons",
      body: (
        <>
          <h3>Informations que vous nous fournissez</h3>
          <ul>
            <li>
              <strong>Informations de compte :</strong> vos nom et prénom, adresse électronique, mot de passe (conservé uniquement sous forme
              hachée) et préférence de langue.
            </li>
            <li>
              <strong>Profil de l’entreprise :</strong> le nom, le logo, l’adresse, le numéro de téléphone et le site web de votre
              entreprise, vos numéros d’identification fiscale et d’immatriculation, les coordonnées bancaires ou de paiement que vous
              choisissez d’afficher sur vos documents, ainsi que vos paramètres par défaut.
            </li>
            <li>
              <strong>Abonnement et facturation :</strong> votre formule, votre période de facturation, votre adresse de facturation et
              l’historique de vos transactions. Les données de carte bancaire sont collectées et traitées par notre prestataire de paiement.
              Nous ne conservons pas les numéros de carte complets.
            </li>
            <li>
              <strong>Échanges :</strong> les messages que vous adressez à notre équipe par e-mail, par chat ou en visioconférence, ainsi
              que vos retours.
            </li>
            <li>
              <strong>Newsletter :</strong> votre adresse électronique et vos préférences d’abonnement.
            </li>
          </ul>
          <h3>Données Client</h3>
          <p>Les informations relatives à vos clients et contacts décrites à l’article 2.</p>
          <h3>Requêtes adressées à Birdy</h3>
          <p>Les instructions que vous donnez à Birdy, notre assistant intelligent, et les brouillons que Birdy prépare en réponse.</p>
          <h3>Informations collectées automatiquement</h3>
          <ul>
            <li>
              <strong>Données techniques et de journalisation :</strong> adresse IP, type et version du navigateur, système d’exploitation,
              pages consultées, pages de provenance, ainsi que les dates et heures de connexion.
            </li>
            <li>
              <strong>Données d’utilisation :</strong> la manière dont vous utilisez les fonctionnalités des Services, afin d’en garantir la
              fiabilité et de les améliorer.
            </li>
            <li>
              <strong>Cookies et technologies similaires :</strong> dans les conditions décrites à l’article 12.
            </li>
          </ul>
          <h3>Informations provenant de tiers</h3>
          <p>
            Lorsque vous connectez Stripe pour encaisser des paiements en ligne, nous recevons de Stripe des informations de paiement, telles
            que le statut, le montant et la date d’un paiement, afin que vos factures puissent être marquées comme payées.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "Finalités et bases légales des traitements",
      body: (
        <>
          <p>Nous utilisons les données personnelles uniquement pour les finalités suivantes, chacune fondée sur une base légale prévue par le RGPD :</p>
          <ul>
            <li>
              <strong>Créer et gérer votre compte et vous fournir les Services</strong>, y compris l’envoi de vos documents ainsi que des
              relances de paiement et notifications que vous avez activées.{" "}
              <em>Base légale : l’exécution de notre contrat avec vous (article 6.1.b du RGPD).</em>
            </li>
            <li>
              <strong>Gérer votre abonnement et vos paiements</strong> et émettre les factures relatives à nos propres services.{" "}
              <em>
                Bases légales : l’exécution d’un contrat et le respect de nos obligations légales, notamment fiscales et comptables (article
                6.1.c).
              </em>
            </li>
            <li>
              <strong>Vous accompagner</strong>, y compris pour la migration de vos données sur les formules payantes.{" "}
              <em>Base légale : l’exécution d’un contrat.</em>
            </li>
            <li>
              <strong>Assurer la sécurité des Services</strong>, prévenir la fraude et les abus, et faire respecter nos Conditions.{" "}
              <em>Base légale : notre intérêt légitime à protéger nos utilisateurs et notre activité (article 6.1.f).</em>
            </li>
            <li>
              <strong>Comprendre l’utilisation des Services et les améliorer</strong>, en recourant autant que possible à des données
              agrégées ou pseudonymisées. <em>Base légale : notre intérêt légitime à développer un meilleur produit.</em>
            </li>
            <li>
              <strong>Vous adresser des communications de service</strong>, telles que des alertes de sécurité ou des modifications de nos
              conditions. <em>Bases légales : l’exécution d’un contrat et le respect de nos obligations légales.</em>
            </li>
            <li>
              <strong>Vous adresser notre newsletter et nos actualités produit.</strong>{" "}
              <em>
                Base légale : votre consentement (article 6.1.a) ou, pour nos clients existants et lorsque la loi le permet, notre intérêt
                légitime à vous informer de services similaires.
              </em>{" "}
              Vous pouvez vous désinscrire à tout moment.
            </li>
            <li>
              <strong>Respecter la loi</strong>, répondre aux demandes légitimes des autorités publiques, et constater, exercer ou défendre
              nos droits en justice. <em>Bases légales : le respect de nos obligations légales et nos intérêts légitimes.</em>
            </li>
          </ul>
          <p>
            Lorsque nous nous fondons sur notre intérêt légitime, nous avons mis en balance cet intérêt avec vos droits et libertés. Vous
            pouvez vous opposer à ces traitements dans les conditions décrites à l’article 11.
          </p>
        </>
      ),
    },
    {
      id: "birdy",
      title: "Birdy, notre assistant intelligent",
      body: (
        <>
          <p>
            Birdy prépare et modifie des documents à partir de vos instructions, en s’appuyant sur les clients, articles, prix et paramètres
            de taxe enregistrés dans votre compte. Pour ce faire, le contenu de votre requête et les données pertinentes de votre compte sont
            traités par Birdy et par les prestataires qui assurent son traitement du langage, agissant pour notre compte.
          </p>
          <ul>
            <li>Birdy agit uniquement à votre demande et uniquement dans votre propre compte.</li>
            <li>Rien de ce que prépare Birdy n’est envoyé à quiconque avant que vous ne l’ayez vérifié et approuvé.</li>
            <li>
              Birdy ne prend à votre égard aucune décision produisant des effets juridiques ou vous affectant de manière significative au sens
              de l’article 22 du RGPD.
            </li>
            <li>
              Nous exigeons de ces prestataires qu’ils traitent les données uniquement pour nous fournir leur service, qu’ils en préservent la
              confidentialité et la sécurité, et qu’ils n’utilisent ni vos requêtes ni les Données Client pour entraîner leurs propres modèles
              à usage général.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "payments",
      title: "Paiements en ligne",
      body: (
        <p>
          Lorsque vous connectez un compte Stripe pour encaisser les paiements par carte de vos clients, ces paiements sont traités par
          Stripe, Inc. et ses sociétés affiliées (« <strong>Stripe</strong> »), conformément à leurs propres conditions et à leur{" "}
          <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer">
            politique de confidentialité
          </a>
          . Les données de carte saisies par vos clients sont collectées directement par Stripe et ne sont jamais conservées sur nos
          serveurs.
        </p>
      ),
    },
    {
      id: "sharing",
      title: "Partage des données personnelles",
      body: (
        <>
          <p>
            Nous ne vendons pas les données personnelles et ne les partageons pas à des fins de publicité ciblée. Nous les partageons
            uniquement dans les cas suivants :
          </p>
          <ul>
            <li>
              <strong>Nos prestataires</strong>, qui hébergent notre infrastructure, acheminent les e-mails, traitent les paiements,
              fournissent nos outils de support, mesurent l’utilisation des Services et font fonctionner Birdy. Ils agissent sur nos
              instructions, dans le cadre de contrats écrits comportant des obligations en matière de protection des données.
            </li>
            <li>
              <strong>Les destinataires de vos documents.</strong> Lorsque vous envoyez une facture, un devis, une proposition commerciale
              ou un contrat, ou que vous partagez un lien, le destinataire voit le contenu que vous avez choisi d’envoyer ainsi que les
              informations de votre entreprise.
            </li>
            <li>
              <strong>Nos conseils professionnels</strong>, tels que nos avocats, experts-comptables et commissaires aux comptes, tenus à
              une obligation de confidentialité.
            </li>
            <li>
              <strong>Les autorités publiques</strong>, lorsque la loi, une décision de justice ou une demande légalement fondée l’exige, ou
              lorsque cela est nécessaire pour protéger les droits, les biens ou la sécurité d’InvoiceBirds, de nos utilisateurs ou de tiers.
            </li>
            <li>
              <strong>Un repreneur</strong>, dans le cadre d’une fusion, d’une acquisition, d’un financement ou de la cession de tout ou
              partie de notre activité, à condition que vos données personnelles restent protégées conformément à la présente politique. Nous
              vous en informerons avant que vos données ne soient soumises à une autre politique de confidentialité.
            </li>
          </ul>
          <p>Nous pouvons également partager des informations agrégées ou anonymisées qui ne permettent pas de vous identifier.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "Transferts internationaux",
      body: (
        <p>
          Certains de nos prestataires sont situés en dehors de l’Espace économique européen (EEE) et du Royaume-Uni. Lorsque nous
          transférons des données personnelles vers un pays qui n’est pas reconnu comme offrant un niveau de protection adéquat, nous nous
          appuyons sur des garanties appropriées, telles que les clauses contractuelles types adoptées par la Commission européenne et
          l’addendum britannique relatif aux transferts internationaux de données, complétées si nécessaire par des mesures
          supplémentaires. Vous pouvez obtenir une copie de ces garanties en nous écrivant à {email}.
        </p>
      ),
    },
    {
      id: "retention",
      title: "Durées de conservation",
      body: (
        <>
          <p>Nous conservons les données personnelles uniquement pendant la durée nécessaire aux finalités décrites dans la présente politique :</p>
          <ul>
            <li>
              <strong>Les données de compte et les Données Client</strong> sont conservées tant que votre compte est actif. Lorsque vous
              supprimez votre compte, nous les supprimons ou les anonymisons dans un délai de 30 jours. Les copies figurant dans nos
              sauvegardes chiffrées sont écrasées dans un délai supplémentaire de 90 jours.
            </li>
            <li>
              <strong>Les pièces de facturation</strong> relatives à nos propres services sont conservées pendant la durée imposée par les
              lois fiscales et comptables applicables, qui peut aller jusqu’à 10 ans.
            </li>
            <li>
              <strong>Les échanges avec le support</strong> sont conservés jusqu’à 3 ans après votre dernier contact avec nous.
            </li>
            <li>
              <strong>Les données de newsletter</strong> sont conservées jusqu’à votre désinscription. Nous conservons ensuite uniquement
              votre adresse électronique dans une liste d’opposition, afin de ne plus vous contacter.
            </li>
            <li>
              <strong>Les données de journalisation</strong> sont conservées jusqu’à 12 mois, sauf si elles sont nécessaires plus longtemps
              pour enquêter sur un incident de sécurité.
            </li>
          </ul>
          <p>
            Il vous appartient de conserver vos propres factures et documents professionnels pendant la durée exigée par la loi. Pensez à
            télécharger les documents dont vous avez besoin avant de supprimer votre compte.
          </p>
        </>
      ),
    },
    {
      id: "security",
      title: "Sécurité",
      body: (
        <>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles destinées à protéger les données personnelles contre la
            destruction, la perte ou l’altération, accidentelles ou illicites, ainsi que contre la divulgation ou l’accès non autorisés. Ces
            mesures comprennent notamment :
          </p>
          <ul>
            <li>le chiffrement des données lors de leur transmission, au moyen du protocole TLS avec un chiffrement 256 bits ;</li>
            <li>un accès aux systèmes de production réservé au personnel habilité qui en a besoin, et journalisé ;</li>
            <li>l’authentification à deux facteurs, que vous pouvez activer sur votre compte ;</li>
            <li>des liens de partage qui donnent accès uniquement au document que vous avez choisi de partager.</li>
          </ul>
          <p>
            Aucun système n’est totalement sûr. Si une violation de données personnelles est susceptible d’engendrer un risque pour vos droits
            et libertés, nous en informerons l’autorité de contrôle compétente et, lorsque la loi l’exige, vous-même, dans les meilleurs
            délais.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Vos droits",
      body: (
        <>
          <p>Dans les conditions prévues par la loi applicable, vous disposez du droit :</p>
          <ul>
            <li>d’accéder à vos données personnelles et d’en obtenir une copie ;</li>
            <li>de faire rectifier les données inexactes ou incomplètes ;</li>
            <li>d’obtenir l’effacement de vos données ;</li>
            <li>d’obtenir la limitation du traitement de vos données ;</li>
            <li>
              de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, et de les faire transmettre à un
              autre responsable du traitement ;
            </li>
            <li>de vous opposer à tout moment aux traitements fondés sur notre intérêt légitime, ainsi qu’à la prospection commerciale ;</li>
            <li>de retirer votre consentement à tout moment, sans que cela remette en cause la licéité des traitements effectués auparavant ;</li>
            <li>lorsque le droit français s’applique, de définir des directives relatives au sort de vos données personnelles après votre décès.</li>
          </ul>
          <p>
            Vous pouvez modifier la plupart de vos informations dans les Paramètres, et supprimer votre compte dans les Paramètres, onglet
            Profil. Pour exercer tout autre droit, écrivez-nous à {email}. Nous vous répondrons dans un délai d’un mois. Ce délai peut être
            prolongé de deux mois pour les demandes complexes ou nombreuses, auquel cas nous vous en informerons. Nous pouvons vous demander
            de justifier de votre identité avant de donner suite à une demande.
          </p>
          <p>
            Vous disposez également du droit d’introduire une réclamation auprès d’une autorité de contrôle, notamment dans le pays où vous
            résidez ou travaillez, comme la Commission nationale de l’informatique et des libertés (CNIL) en France ou l’Information
            Commissioner’s Office (ICO) au Royaume-Uni. Nous vous serions toutefois reconnaissants de nous permettre de répondre d’abord à vos
            préoccupations.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies et technologies similaires",
      body: (
        <>
          <p>
            Nous utilisons des cookies et technologies similaires strictement nécessaires au fonctionnement des Services, par exemple pour
            maintenir votre session, protéger les formulaires contre les abus et mémoriser votre choix de langue. Ces cookies ne nécessitent
            pas votre consentement.
          </p>
          <p>
            Nous n’utilisons de cookies de mesure d’audience ou d’autres cookies non essentiels qu’avec votre consentement lorsque la loi
            l’exige, et vous pouvez retirer ce consentement à tout moment. Vous pouvez également bloquer ou supprimer les cookies depuis les
            paramètres de votre navigateur. Si vous bloquez les cookies strictement nécessaires, certaines parties des Services risquent de
            ne pas fonctionner.
          </p>
        </>
      ),
    },
    {
      id: "emails",
      title: "Les e-mails que nous envoyons",
      body: (
        <p>
          Nous envoyons des e-mails de service qui font partie des Services, tels que les messages relatifs à votre compte, à la sécurité et
          à la facturation. Vous pouvez choisir les notifications que vous recevez dans les Paramètres. Nous n’envoyons notre newsletter et
          nos e-mails commerciaux que dans les conditions décrites à l’article 4, et chacun d’eux comporte un lien de désinscription.
        </p>
      ),
    },
    {
      id: "children",
      title: "Mineurs",
      body: (
        <p>
          Les Services sont destinés aux professionnels et aux entreprises et ne s’adressent pas aux mineurs. Nous ne collectons pas
          sciemment de données personnelles concernant des personnes de moins de 16 ans. Si vous pensez qu’un mineur nous a communiqué des
          données personnelles, contactez-nous et nous les supprimerons.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Sites et services tiers",
      body: (
        <p>
          Les Services peuvent renvoyer vers des sites et services exploités par des tiers, ou s’intégrer à ceux-ci, comme Stripe. Le
          traitement de vos données par ces tiers est régi par leurs propres politiques de confidentialité, que nous vous invitons à
          consulter.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Modifications de la présente politique",
      body: (
        <p>
          Nous pouvons mettre à jour la présente politique de temps à autre. La date figurant en haut de la page indique sa dernière
          modification. En cas de modification substantielle, nous vous en informerons par e-mail ou dans l’application, si possible au
          moins 30 jours avant son entrée en vigueur.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Nous contacter",
      body: <p>Pour toute question concernant la présente politique ou vos données personnelles, écrivez-nous à {email}.</p>,
    },
  ],
};
