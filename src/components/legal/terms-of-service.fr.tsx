import Link from "next/link";

import { siteConfig } from "@/config/site";

import type { LegalDocument } from "./legal-page";

const email = <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>;

export const termsFr: LegalDocument = {
  title: "Conditions d’utilisation",
  lead: "Le contrat qui vous lie à InvoiceBirds pour l’utilisation de notre site, de notre application et de nos services.",
  updated: "6 novembre 2026",
  summary: [
    "La formule Gratuite est gratuite. Les formules payantes se renouvellent automatiquement jusqu’à leur résiliation, possible à tout moment.",
    "Vos contenus et les données de vos clients vous appartiennent. Nous les utilisons uniquement pour vous fournir InvoiceBirds.",
    "Birdy prépare des brouillons, et rien n’est envoyé sans votre accord. Vérifiez toujours vos documents avant de les envoyer.",
    "Vous restez responsable de vos factures, de vos impôts et de vos obligations légales. InvoiceBirds ne fournit aucun conseil fiscal ou juridique.",
    "Les paiements par carte en ligne sont traités par Stripe, dans le cadre de votre propre contrat avec Stripe.",
  ],
  intro: (
    <p>
      Nous vous invitons à lire attentivement les présentes Conditions. Elles définissent vos droits et obligations lorsque vous utilisez
      InvoiceBirds, y compris d’importantes limitations de notre responsabilité à l’article 17. Si vous êtes un consommateur, l’article 19
      précise les droits dont vous bénéficiez en toutes circonstances.
    </p>
  ),
  sections: [
    {
      id: "agreement",
      title: "Acceptation des Conditions",
      body: (
        <>
          <p>
            Les présentes conditions d’utilisation (les « <strong>Conditions</strong> ») constituent un contrat juridiquement contraignant
            entre vous et InvoiceBirds (« <strong>InvoiceBirds</strong> », « <strong>nous</strong> » ou « <strong>notre</strong> »). Elles
            régissent votre accès à invoicebirds.com, à l’application web InvoiceBirds et à l’ensemble des services, fonctionnalités et
            contenus associés (les « <strong>Services</strong> »), ainsi que leur utilisation.
          </p>
          <p>
            En créant un compte, en acceptant les présentes Conditions ou en utilisant les Services, vous acceptez les présentes Conditions et
            reconnaissez avoir pris connaissance de notre <Link href="/fr/privacy">Politique de confidentialité</Link>. Si vous utilisez les
            Services pour le compte d’une société ou d’une autre organisation, vous déclarez être habilité à accepter les présentes Conditions
            en son nom, et le terme « vous » désigne alors cette organisation. Si vous n’acceptez pas les présentes Conditions, vous ne devez
            pas utiliser les Services.
          </p>
        </>
      ),
    },
    {
      id: "eligibility",
      title: "Conditions d’accès",
      body: (
        <p>
          Vous devez être âgé d’au moins 18 ans et disposer de la capacité juridique de conclure un contrat. Les Services sont conçus pour
          permettre aux indépendants, aux professionnels et aux entreprises de gérer leur activité commerciale.
        </p>
      ),
    },
    {
      id: "account",
      title: "Votre compte",
      body: (
        <ul>
          <li>Vous devez fournir des informations exactes et complètes lors de votre inscription, et les tenir à jour.</li>
          <li>
            Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée depuis votre compte. Nous vous
            recommandons vivement d’activer l’authentification à deux facteurs.
          </li>
          <li>Chaque identifiant est strictement personnel et ne doit pas être partagé.</li>
          <li>Vous devez nous informer sans délai à l’adresse {email} de toute utilisation non autorisée de votre compte.</li>
        </ul>
      ),
    },
    {
      id: "plans",
      title: "Formules, tarifs et facturation",
      body: (
        <>
          <h3>4.1 Formule Gratuite</h3>
          <p>
            La formule Gratuite est fournie sans frais, avec les fonctionnalités et limites indiquées sur notre page Tarifs au moment où vous
            l’utilisez. Nous pouvons faire évoluer ces fonctionnalités et limites.
          </p>
          <h3>4.2 Abonnements payants</h3>
          <p>
            Les formules Professional et Growth sont des abonnements payables d’avance, mensuellement ou annuellement, au prix affiché lors de
            votre souscription. Les prix s’entendent hors taxes applicables, telles que la TVA, qui sont ajoutées lorsque la loi l’exige.
          </p>
          <h3>4.3 Renouvellement automatique</h3>
          <p>
            Les abonnements payants sont renouvelés automatiquement à la fin de chaque période de facturation pour une période de même durée,
            sauf résiliation avant la date de renouvellement. Vous nous autorisez, ainsi que notre prestataire de paiement, à débiter votre
            moyen de paiement à chaque renouvellement.
          </p>
          <h3>4.4 Changement de formule et résiliation</h3>
          <p>
            Vous pouvez passer à une formule supérieure ou inférieure, basculer entre la facturation mensuelle et annuelle, ou résilier à tout
            moment depuis les Paramètres, onglet Facturation et abonnement. Le passage à une formule supérieure prend effet immédiatement, et
            la différence de prix peut être calculée au prorata, comme indiqué lors du paiement. Le passage à une formule inférieure et la
            résiliation prennent effet à la fin de la période de facturation en cours, et vous conservez l’accès à vos fonctionnalités
            payantes jusqu’à cette date.
          </p>
          <h3>4.5 Remboursements</h3>
          <p>
            Sauf disposition légale contraire, notamment au titre de l’article 19, ou stipulation expresse des présentes Conditions, les
            sommes déjà versées ne sont pas remboursables, y compris pour une période de facturation partiellement utilisée.
          </p>
          <h3>4.6 Requêtes Birdy</h3>
          <p>
            Les formules payantes incluent un nombre mensuel de requêtes Birdy, indiqué sur notre page Tarifs. Les requêtes non utilisées ne
            sont pas reportées sur le mois suivant.
          </p>
          <h3>4.7 Évolution des prix</h3>
          <p>
            Nous pouvons modifier nos prix. Nous vous en informerons au moins 30 jours à l’avance, et le nouveau prix s’appliquera à compter de
            votre prochain renouvellement. Si vous n’acceptez pas le nouveau prix, vous pouvez résilier avant son entrée en vigueur.
          </p>
          <h3>4.8 Incidents de paiement</h3>
          <p>
            En cas d’échec d’un paiement, nous pouvons renouveler la tentative de prélèvement. Si la somme reste impayée après notification,
            nous pouvons suspendre vos fonctionnalités payantes ou faire passer votre compte à la formule Gratuite jusqu’au règlement.
          </p>
        </>
      ),
    },
    {
      id: "birdy",
      title: "Birdy, notre assistant intelligent",
      body: (
        <p>
          Birdy prépare et met à jour des brouillons à partir de vos instructions et des données de votre compte. Les suggestions de Birdy
          peuvent parfois être incomplètes ou inexactes. Vous devez vérifier chaque brouillon avant de l’approuver, de l’envoyer ou de vous
          y fier, et vous êtes responsable des documents que vous émettez. Rien de ce que prépare Birdy n’est envoyé sans votre accord. Vos
          requêtes à Birdy doivent respecter l’article 10.
        </p>
      ),
    },
    {
      id: "your-documents",
      title: "Vos documents et vos obligations",
      body: (
        <>
          <p>
            InvoiceBirds est un outil logiciel. Nous ne fournissons aucun conseil juridique, fiscal, comptable ou financier. Vous êtes seul
            responsable :
          </p>
          <ul>
            <li>
              de l’exactitude et de l’exhaustivité des documents que vous créez et envoyez, notamment des montants, des taux de taxe, des
              numéros d’identification fiscale et des mentions obligatoires ;
            </li>
            <li>
              de l’identification et du respect de vos obligations en matière de facturation, de fiscalité, de facturation électronique, de
              conservation des documents et de protection des consommateurs, dans chaque pays où vous exercez votre activité ;
            </li>
            <li>de la conservation de vos documents pendant la durée exigée par la loi.</li>
          </ul>
          <p>
            Les modèles, textes par défaut et clauses types, y compris les exemples de propositions commerciales et de contrats, sont fournis
            à titre indicatif uniquement et doivent être vérifiés par un professionnel qualifié avant toute utilisation. Les exports de
            factures électroniques respectent les spécifications publiées des formats que nous prenons en charge, mais il vous appartient de
            vérifier qu’un format est accepté par votre destinataire et conforme aux règles qui vous sont applicables.
          </p>
        </>
      ),
    },
    {
      id: "payments",
      title: "Paiements en ligne",
      body: (
        <p>
          Les paiements par carte en ligne sont fournis par Stripe. Pour les accepter, vous devez créer ou connecter un compte Stripe et
          accepter les conditions de Stripe, y compris le Stripe Connected Account Agreement. InvoiceBirds n’est ni une banque ni un
          établissement de paiement, et n’est pas partie aux opérations de paiement entre vous et vos clients. Les frais, les délais de
          versement, les blocages de fonds, les remboursements et les litiges liés à Stripe sont régis par votre contrat avec Stripe. Nous ne
          sommes pas responsables des services de Stripe, ni d’un échec ou d’un retard des paiements traités par Stripe.
        </p>
      ),
    },
    {
      id: "signatures",
      title: "Propositions commerciales, contrats et signature électronique",
      body: (
        <p>
          Les Services permettent à vos clients d’accepter des propositions commerciales et de signer des contrats électroniquement. La
          validité et l’opposabilité d’une signature électronique pour un contrat donné dépendent de la loi applicable et du contrat lui-même,
          et relèvent de votre responsabilité. InvoiceBirds n’est ni partie, ni mandataire, ni prestataire de services de confiance au titre
          d’un quelconque contrat conclu entre vous et vos clients.
        </p>
      ),
    },
    {
      id: "your-content",
      title: "Vos contenus",
      body: (
        <>
          <p>
            Vous conservez l’ensemble des droits sur les contenus et les Données Client que vous importez dans les Services ou créez avec
            ceux-ci (« <strong>Vos Contenus</strong> »). Vous concédez à InvoiceBirds une licence mondiale, non exclusive et gratuite pour
            héberger, stocker, reproduire, traiter, transmettre et afficher Vos Contenus, dans le seul but de vous fournir les Services, d’en
            assurer la sécurité et de vous accompagner, ainsi que conformément à vos autres instructions. Cette licence prend fin lorsque Vos
            Contenus sont supprimés des Services, sous réserve des durées de sauvegarde décrites dans notre Politique de confidentialité.
          </p>
          <p>
            Vous garantissez disposer de l’ensemble des droits, autorisations et bases légales nécessaires pour importer Vos Contenus et nous
            permettre de les traiter conformément aux présentes Conditions, y compris pour les données personnelles de vos clients et
            contacts.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Utilisation acceptable",
      body: (
        <>
          <p>Vous vous engagez à ne pas, et à ne permettre à personne de :</p>
          <ul>
            <li>utiliser les Services à des fins illicites, frauduleuses ou trompeuses, notamment pour émettre des documents faux ou trompeurs ;</li>
            <li>envoyer des messages indésirables ou non sollicités au moyen des Services ;</li>
            <li>
              importer des contenus portant atteinte aux droits de tiers, ou illicites, préjudiciables ou diffamatoires, ou contenant du code
              malveillant ;
            </li>
            <li>
              tenter d’accéder sans autorisation aux Services, à d’autres comptes ou à nos systèmes, ou en sonder, analyser ou tester la
              vulnérabilité sans notre autorisation écrite ;
            </li>
            <li>porter atteinte à l’intégrité ou aux performances des Services, notamment par des requêtes automatisées excessives ;</li>
            <li>
              copier, modifier, décompiler ou désassembler les Services, ou en créer des œuvres dérivées, sauf dans la mesure expressément
              autorisée par la loi ;
            </li>
            <li>revendre, sous-licencier ou fournir les Services à des tiers, sauf autorisation écrite et expresse de notre part ;</li>
            <li>utiliser les Services ou Birdy pour développer un produit concurrent, ou extraire des données des Services par des moyens automatisés.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-ip",
      title: "Notre propriété intellectuelle",
      body: (
        <p>
          Les Services, y compris les logiciels, le design, les textes, les graphismes, le personnage de Birdy, les logos et les marques,
          appartiennent à InvoiceBirds ou à ses concédants et sont protégés par le droit de la propriété intellectuelle. Sous réserve des
          présentes Conditions, nous vous concédons un droit limité, non exclusif, non transférable et révocable d’utiliser les Services pour
          les besoins de votre activité. Tous les droits qui ne sont pas expressément concédés sont réservés. Si vous nous adressez des
          commentaires ou suggestions, nous pouvons les utiliser librement, sans aucune obligation envers vous.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Services tiers",
      body: (
        <p>
          Les Services peuvent s’intégrer à des services fournis par des tiers, comme Stripe, ou y renvoyer. Votre utilisation de ces services
          est régie par leurs propres conditions, et nous n’en sommes pas responsables. Nous pouvons cesser de prendre en charge une
          intégration si son fournisseur la modifie ou y met fin.
        </p>
      ),
    },
    {
      id: "data-protection",
      title: "Protection des données",
      body: (
        <>
          <p>
            Notre <Link href="/fr/privacy">Politique de confidentialité</Link> explique comment nous traitons les données personnelles en qualité de
            responsable du traitement. Pour les Données Client, vous êtes responsable du traitement et InvoiceBirds est votre sous-traitant.
            À ce titre, et conformément à l’article 28 du RGPD, nous nous engageons à :
          </p>
          <ol>
            <li>
              traiter les Données Client uniquement sur vos instructions documentées, constituées des présentes Conditions et de votre
              utilisation des Services, sauf obligation légale contraire ;
            </li>
            <li>veiller à ce que les personnes autorisées à traiter les Données Client soient soumises à une obligation de confidentialité ;</li>
            <li>mettre en œuvre des mesures de sécurité techniques et organisationnelles appropriées ;</li>
            <li>
              ne recourir à des sous-traitants ultérieurs que dans le cadre de contrats écrits leur imposant des obligations équivalentes en
              matière de protection des données, et vous informer de tout changement envisagé concernant ces sous-traitants, en vous donnant
              la possibilité de vous y opposer. Vous nous accordez une autorisation générale de recourir à des sous-traitants ultérieurs dans
              ces conditions ;
            </li>
            <li>
              compte tenu de la nature du traitement, vous aider à répondre aux demandes des personnes concernées et à respecter vos
              obligations en matière de sécurité, de notification des violations, d’analyse d’impact et de consultation préalable ;
            </li>
            <li>vous notifier dans les meilleurs délais toute violation de données personnelles affectant les Données Client dont nous avons connaissance ;</li>
            <li>
              au terme des Services, supprimer les Données Client après vous avoir permis de les télécharger, sauf obligation légale de
              conservation ;
            </li>
            <li>
              mettre à votre disposition les informations nécessaires pour démontrer le respect de ces obligations, et permettre la
              réalisation d’audits et y contribuer, moyennant un préavis raisonnable et sous réserve de confidentialité.
            </li>
          </ol>
          <p>
            Lorsque des Données Client sont transférées hors de l’Espace économique européen ou du Royaume-Uni, nous nous appuyons sur les
            garanties décrites dans notre Politique de confidentialité. La liste de nos sous-traitants ultérieurs est disponible sur demande à
            l’adresse {email}.
          </p>
        </>
      ),
    },
    {
      id: "availability",
      title: "Disponibilité et évolution des Services",
      body: (
        <p>
          Nous mettons tout en œuvre pour assurer la disponibilité et la fiabilité des Services, sans toutefois garantir qu’ils fonctionneront
          sans interruption ni erreur. Nous pouvons procéder à des opérations de maintenance, que nous nous efforçons de planifier de manière
          à limiter la gêne occasionnée. Nous améliorons continuellement les Services et pouvons ajouter, modifier ou supprimer des
          fonctionnalités. Si une modification réduit de manière substantielle les fonctionnalités essentielles de votre formule payante au
          cours de votre période de facturation, nous vous en informerons à l’avance, et vous pourrez résilier et obtenir le remboursement, au
          prorata, des sommes versées pour la période restante.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Suspension et résiliation",
      body: (
        <>
          <p>
            Vous pouvez cesser d’utiliser les Services à tout moment et supprimer votre compte depuis les Paramètres, onglet Profil. La
            suppression de votre compte entraîne la suppression définitive de Vos Contenus, sous réserve des durées de sauvegarde décrites
            dans notre Politique de confidentialité. Pensez donc à télécharger au préalable tout ce dont vous avez besoin.
          </p>
          <p>
            Nous pouvons suspendre ou résilier votre accès aux Services en cas de manquement grave aux présentes Conditions, notamment en cas
            de défaut de paiement, si votre utilisation fait peser un risque de sécurité ou un risque juridique sur nous, nos utilisateurs ou
            des tiers, ou si la loi nous y oblige. Lorsque cela est raisonnable, nous vous en informerons au préalable et vous donnerons la
            possibilité de remédier à la situation. Sauf si la résiliation résulte d’une utilisation illicite des Services, vous disposerez
            de 30 jours pour télécharger Vos Contenus.
          </p>
          <p>
            Nous pouvons également mettre fin à l’ensemble des Services moyennant un préavis d’au moins 60 jours. Dans ce cas, nous vous
            rembourserons les sommes versées d’avance pour la période postérieure à la résiliation.
          </p>
          <p>
            À la résiliation, votre droit d’utiliser les Services prend fin. Les stipulations qui, par leur nature, ont vocation à survivre à
            la résiliation, notamment les articles 4 (pour les sommes dues), 6, 11 et 16 à 22, restent en vigueur.
          </p>
        </>
      ),
    },
    {
      id: "disclaimers",
      title: "Exclusion de garanties",
      body: (
        <p>
          Dans toute la mesure permise par la loi, les Services sont fournis « en l’état » et « selon leur disponibilité », et nous excluons
          toute garantie, expresse ou implicite, notamment toute garantie implicite de qualité marchande, d’adéquation à un usage particulier
          et d’absence de contrefaçon. Le présent article ne porte pas atteinte aux droits légaux qui ne peuvent être exclus ou limités par
          contrat.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation de responsabilité",
      body: (
        <>
          <p>
            <strong>17.1</strong> Aucune stipulation des présentes Conditions ne limite ni n’exclut la responsabilité en cas de décès ou de
            dommage corporel causé par une négligence, de fraude ou de déclaration frauduleuse, de faute lourde ou de faute intentionnelle, ni
            toute autre responsabilité qui ne peut être limitée ou exclue par la loi.
          </p>
          <p>
            <strong>17.2</strong> Sous réserve de l’article 17.1, InvoiceBirds ne saurait être tenue responsable, que ce soit sur un
            fondement contractuel, délictuel (y compris en cas de négligence) ou autre, des dommages indirects ou consécutifs, de toute perte
            de bénéfices, de chiffre d’affaires, d’activité, de clientèle ou d’économies escomptées, ni de toute perte ou altération de
            données que vous auriez pu éviter en conservant vos propres copies.
          </p>
          <p>
            <strong>17.3</strong> Sous réserve de l’article 17.1, notre responsabilité totale au titre des présentes Conditions ou en lien
            avec celles-ci, sur toute période de 12 mois, est limitée au plus élevé des deux montants suivants : (a) les sommes que vous nous
            avez versées pour les Services au cours des 12 mois précédant le fait générateur de la réclamation et (b) 100 dollars américains.
          </p>
        </>
      ),
    },
    {
      id: "indemnity",
      title: "Garantie",
      body: (
        <p>
          Si vous utilisez les Services à des fins professionnelles, vous vous engagez à garantir InvoiceBirds contre toute réclamation de
          tiers, ainsi que contre les dommages, pertes et frais raisonnables qui en résultent, y compris les honoraires d’avocat, découlant
          de Vos Contenus, d’un manquement de votre part aux présentes Conditions ou d’une violation de la loi ou des droits d’un tiers. Nous
          vous informerons rapidement de toute réclamation de ce type et vous permettrons d’en assurer la défense.
        </p>
      ),
    },
    {
      id: "consumers",
      title: "Si vous êtes un consommateur",
      body: (
        <>
          <p>
            Les Services sont destinés à un usage professionnel. Si vous les utilisez néanmoins en tant que consommateur, vous bénéficiez des
            protections impératives de la loi de votre pays de résidence, et aucune stipulation des présentes Conditions ne limite ces
            droits.
          </p>
          <p>
            Si vous êtes un consommateur résidant dans l’Union européenne ou au Royaume-Uni, vous pouvez vous rétracter d’un abonnement payant
            dans un délai de 14 jours à compter de votre souscription, sans avoir à motiver votre décision. Si vous avez demandé que
            l’exécution des Services commence pendant ce délai, nous pouvons conserver un montant proportionnel aux Services fournis jusqu’à
            votre rétractation. Pour vous rétracter, écrivez-nous à {email}.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Modification des Conditions",
      body: (
        <p>
          Nous pouvons modifier les présentes Conditions. En cas de modification substantielle, nous vous en informerons par e-mail ou dans
          l’application au moins 30 jours avant son entrée en vigueur. Si vous n’acceptez pas les Conditions modifiées, vous pouvez résilier
          votre abonnement et fermer votre compte avant leur entrée en vigueur. Si vous continuez à utiliser les Services après cette date,
          vous acceptez les Conditions modifiées.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "Droit applicable et litiges",
      body: (
        <>
          <p>
            Les présentes Conditions, ainsi que tout litige ou toute réclamation en découlant ou s’y rapportant, sont régis par le droit du
            pays dans lequel InvoiceBirds a son siège social, sans égard à ses règles de conflit de lois.
          </p>
          <p>
            Avant toute action en justice, vous et nous convenons de rechercher une solution amiable en adressant une demande écrite à
            l’autre partie. Vous pouvez nous joindre à l’adresse {email}. À défaut de résolution dans un délai de 30 jours, le litige sera
            soumis aux tribunaux compétents du lieu du siège social d’InvoiceBirds, sauf si une disposition impérative vous permet de saisir
            une autre juridiction, notamment en tant que consommateur.
          </p>
        </>
      ),
    },
    {
      id: "general",
      title: "Dispositions générales",
      body: (
        <ul>
          <li>
            <strong>Intégralité.</strong> Les présentes Conditions, ainsi que notre Politique de confidentialité et les caractéristiques de
            votre formule, constituent l’intégralité de l’accord entre vous et InvoiceBirds concernant les Services.
          </li>
          <li>
            <strong>Cession.</strong> Vous ne pouvez pas céder vos droits ou obligations au titre des présentes Conditions sans notre accord
            écrit préalable. Nous pouvons les céder dans le cadre d’une fusion, d’une acquisition ou d’une cession d’actifs, et nous vous en
            informerons le cas échéant.
          </li>
          <li>
            <strong>Divisibilité.</strong> Si une stipulation des présentes Conditions est jugée nulle ou inapplicable, les autres
            stipulations conservent leur plein effet.
          </li>
          <li>
            <strong>Absence de renonciation.</strong> Le fait de ne pas exercer un droit, ou de l’exercer tardivement, ne vaut pas
            renonciation à ce droit.
          </li>
          <li>
            <strong>Force majeure.</strong> Aucune des parties n’est responsable d’un manquement ou d’un retard résultant d’événements
            échappant à son contrôle raisonnable.
          </li>
          <li>
            <strong>Notifications.</strong> Nous pouvons vous adresser des notifications par e-mail à l’adresse associée à votre compte ou
            dans l’application. Vous pouvez nous adresser vos notifications à l’adresse {email}.
          </li>
          <li>
            <strong>Langue.</strong> Les présentes Conditions sont disponibles en anglais et en français. En cas de divergence, la version
            anglaise prévaut, sauf disposition légale contraire.
          </li>
        </ul>
      ),
    },
    {
      id: "contact",
      title: "Nous contacter",
      body: <p>Pour toute question concernant les présentes Conditions, écrivez-nous à {email}.</p>,
    },
  ],
};
